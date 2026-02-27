import crypto from "crypto";
import Order from "../models/order.model.js";
import {
  buildEsewaSignatureString,
  generateEsewaSignature,
  verifyEsewaPayment,
} from "../utils/payment.js";

const getRequiredEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const getEnvOrDefault = (key, fallback) => {
  return process.env[key] || fallback;
};

const amountsEqual = (a, b) => Math.abs(Number(a) - Number(b)) < 0.0001;

const normalizeOrderItems = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      productId:
        item?.productId ||
        item?._id ||
        item?.id ||
        item?.product?._id ||
        item?.productId?._id,
      name: item?.name || item?.title || item?.productName,
      price: Number(item?.price ?? item?.unitPrice ?? 0),
      quantity: Number(item?.quantity ?? item?.qty ?? 0),
      image: item?.image || item?.thumbnail || item?.images?.[0] || "",
    }))
    .filter((item) => item.productId && item.name && item.quantity > 0);
};

const initiateEsewaPayment = async (req, res) => {
  try {
    const esewaBaseUrl = getEnvOrDefault(
      "ESEWA_BASE_URL",
      "https://rc-epay.esewa.com.np",
    );
    const esewaProductCode = getEnvOrDefault("ESEWA_PRODUCT_CODE", "EPAYTEST");
    const esewaSecretKey = getEnvOrDefault(
      "ESEWA_SECRET_KEY",
      "8gBm/:&EnhH.1/q",
    );
    const backendBaseUrl = getEnvOrDefault(
      "BACKEND_BASE_URL",
      "http://localhost:3001",
    );
    const frontendBaseUrl = getEnvOrDefault(
      "FRONTEND_BASE_URL",
      "http://localhost:5173",
    );

    const {
      amount,
      items = [],
      shippingAddress,
      billingAddress,
      paymentMethod = "esewa",
    } = req.body;

    const normalizedItems = normalizeOrderItems(items);
    if (
      Array.isArray(items) &&
      items.length > 0 &&
      normalizedItems.length === 0
    ) {
      return res.status(400).json({
        message: "Invalid cart items. Please refresh your cart and try again.",
      });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const transactionUuid = `${Date.now()}-${crypto.randomUUID()}`;
    const normalizedAmount = Number(amount).toFixed(2);

    const order = await Order.create({
      user: req.authUser._id,
      items: normalizedItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      subtotal: Number(amount),
      shippingCost: 0,
      totalAmount: Number(amount),
      paymentStatus: "pending",
      orderStatus: "pending",
      transactionUuid,
    });

    const signedFieldNames = "total_amount,transaction_uuid,product_code";
    const signatureString = buildEsewaSignatureString({
      totalAmount: normalizedAmount,
      transactionUuid,
      productCode: esewaProductCode,
    });

    const signature = generateEsewaSignature(esewaSecretKey, signatureString);

    const successUrl = `${backendBaseUrl}/api/orders/esewa/success?orderId=${order._id}&redirect=${encodeURIComponent(frontendBaseUrl)}`;
    const failureUrl = `${backendBaseUrl}/api/orders/esewa/failure?orderId=${order._id}&redirect=${encodeURIComponent(frontendBaseUrl)}`;

    const esewaConfig = {
      amount: normalizedAmount,
      tax_amount: "0",
      total_amount: normalizedAmount,
      transaction_uuid: transactionUuid,
      product_code: esewaProductCode,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: signedFieldNames,
      signature,
    };

    return res.status(201).json({
      message: "eSewa payment initiated",
      orderId: order._id,
      paymentUrl: `${esewaBaseUrl}/api/epay/main/v2/form`,
      esewaConfig,
    });
  } catch (error) {
    console.error("initiateEsewaPayment error:", error);
    if (error?.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid order data",
        error: error?.message,
      });
    }
    return res.status(500).json({
      message: "Failed to initiate eSewa payment",
      error: error?.message || "Unknown error",
    });
  }
};

const initiateKhaltiPayment = async (req, res) => {
  try {
    const khaltiSecretKey = getEnvOrDefault("KHALTI_SECRET_KEY", "");
    const frontendBaseUrl = getEnvOrDefault(
      "FRONTEND_BASE_URL",
      "http://localhost:5173",
    );
    const khaltiInitiateUrl =
      process.env.KHALTI_INITIATE_URL ||
      "https://a.khalti.com/api/v2/epayment/initiate/";

    if (!khaltiSecretKey) {
      return res.status(500).json({
        message: "KHALTI_SECRET_KEY is missing",
      });
    }

    const {
      amount,
      items = [],
      shippingAddress,
      billingAddress,
      paymentMethod = "khalti",
    } = req.body;

    const normalizedItems = normalizeOrderItems(items);
    if (
      Array.isArray(items) &&
      items.length > 0 &&
      normalizedItems.length === 0
    ) {
      return res.status(400).json({
        message: "Invalid cart items. Please refresh your cart and try again.",
      });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const order = await Order.create({
      user: req.authUser._id,
      items: normalizedItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      subtotal: Number(amount),
      shippingCost: 0,
      totalAmount: Number(amount),
      paymentStatus: "pending",
      orderStatus: "pending",
      transactionUuid: `${Date.now()}-${crypto.randomUUID()}`,
    });

    const khaltiPayload = {
      return_url: `${frontendBaseUrl}/shipping-billing-address?method=khalti&orderId=${order._id}`,
      website_url: frontendBaseUrl,
      amount: Math.round(Number(amount) * 100),
      purchase_order_id: String(order._id),
      purchase_order_name: `Order-${order._id}`,
      customer_info: {
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
        email: req.authUser.email || "customer@example.com",
        phone: shippingAddress.phone,
      },
    };

    const response = await fetch(khaltiInitiateUrl, {
      method: "POST",
      headers: {
        Authorization: `Key ${khaltiSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(khaltiPayload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Khalti initiate failed:", errorBody);
      return res
        .status(400)
        .json({ message: "Failed to initiate Khalti payment" });
    }

    const data = await response.json();

    return res.status(201).json({
      message: "Khalti payment initiated",
      orderId: order._id,
      paymentUrl: data.payment_url,
      pidx: data.pidx,
    });
  } catch (error) {
    console.error("initiateKhaltiPayment error:", error);
    if (error?.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid order data",
        error: error?.message,
      });
    }
    return res
      .status(500)
      .json({ message: "Failed to initiate Khalti payment" });
  }
};

const handleEsewaSuccess = async (req, res) => {
  try {
    const esewaBaseUrl = getRequiredEnv("ESEWA_BASE_URL");
    const esewaProductCode = getRequiredEnv("ESEWA_PRODUCT_CODE");
    const orderId = req.query.orderId;
    const redirectBase = req.query.redirect || process.env.FRONTEND_BASE_URL;

    if (!orderId) {
      return res.status(400).send("Missing orderId");
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send("Order not found");
    }

    if (order.paymentStatus === "paid") {
      return res.redirect(
        `${redirectBase}/shipping-billing-address?payment=success&orderId=${order._id}`,
      );
    }

    const encodedData = req.query.data;
    if (!encodedData) {
      return res.redirect(
        `${redirectBase}/shipping-billing-address?payment=failed&orderId=${order._id}`,
      );
    }

    let decodedData;
    try {
      const decodedJson = Buffer.from(encodedData, "base64").toString("utf8");
      decodedData = JSON.parse(decodedJson);
    } catch (error) {
      console.error("Failed to decode eSewa callback data:", error);
      return res.redirect(
        `${redirectBase}/shipping-billing-address?payment=failed&orderId=${order._id}`,
      );
    }

    if (decodedData?.status !== "COMPLETE") {
      order.paymentStatus = "failed";
      await order.save();
      return res.redirect(
        `${redirectBase}/shipping-billing-address?payment=failed&orderId=${order._id}`,
      );
    }

    if (decodedData?.transaction_uuid !== order.transactionUuid) {
      order.paymentStatus = "failed";
      await order.save();
      return res.redirect(
        `${redirectBase}/shipping-billing-address?payment=failed&orderId=${order._id}`,
      );
    }

    const decodedAmount = Number(decodedData?.total_amount || 0);
    if (!amountsEqual(decodedAmount, Number(order.totalAmount))) {
      order.paymentStatus = "failed";
      await order.save();
      return res.redirect(
        `${redirectBase}/shipping-billing-address?payment=failed&orderId=${order._id}`,
      );
    }

    const duplicateTxnOrder = await Order.findOne({
      _id: { $ne: order._id },
      esewaTransactionUuid: decodedData.transaction_uuid,
    });

    if (duplicateTxnOrder) {
      order.paymentStatus = "failed";
      await order.save();
      return res.redirect(
        `${redirectBase}/shipping-billing-address?payment=failed&orderId=${order._id}`,
      );
    }

    const verification = await verifyEsewaPayment({
      baseUrl: esewaBaseUrl,
      productCode: esewaProductCode,
      totalAmount: Number(order.totalAmount).toFixed(2),
      transactionUuid: order.transactionUuid,
    });

    const isPaid =
      verification?.status === "COMPLETE" ||
      verification?.status === "Completed" ||
      verification?.status === "Success";

    const verificationAmount = Number(verification?.total_amount || 0);
    const validAmount = amountsEqual(
      verificationAmount,
      Number(order.totalAmount),
    );
    const validTxn = verification?.transaction_uuid === order.transactionUuid;

    if (isPaid && validAmount && validTxn) {
      const existingPaymentWithTxn = await Order.findOne({
        _id: { $ne: order._id },
        esewaTransactionUuid: verification.transaction_uuid,
      });

      if (existingPaymentWithTxn) {
        order.paymentStatus = "failed";
        await order.save();
        return res.redirect(
          `${redirectBase}/shipping-billing-address?payment=failed&orderId=${order._id}`,
        );
      }

      const updateResult = await Order.updateOne(
        {
          _id: order._id,
          paymentStatus: { $ne: "paid" },
          esewaTransactionUuid: null,
        },
        {
          $set: {
            paymentStatus: "paid",
            orderStatus: "confirmed",
            esewaTransactionUuid: verification.transaction_uuid,
            esewaRefId: verification?.ref_id || null,
            paymentReference:
              verification?.ref_id || verification?.transaction_code || "",
          },
        },
      );

      if (updateResult.modifiedCount === 0) {
        return res.redirect(
          `${redirectBase}/shipping-billing-address?payment=failed&orderId=${order._id}`,
        );
      }

      return res.redirect(
        `${redirectBase}/shipping-billing-address?payment=success&orderId=${order._id}`,
      );
    }

    order.paymentStatus = "failed";
    await order.save();
    return res.redirect(
      `${redirectBase}/shipping-billing-address?payment=failed&orderId=${order._id}`,
    );
  } catch (error) {
    console.error("handleEsewaSuccess error:", error);
    return res.status(500).send("Payment verification failed");
  }
};

const handleEsewaFailure = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const redirectBase = req.query.redirect || process.env.FRONTEND_BASE_URL;

    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = "failed";
        order.orderStatus = "cancelled";
        await order.save();
      }
    }

    return res.redirect(
      `${redirectBase}/shipping-billing-address?payment=failed${orderId ? `&orderId=${orderId}` : ""}`,
    );
  } catch (error) {
    console.error("handleEsewaFailure error:", error);
    return res.status(500).send("Failed to process payment failure");
  }
};

const verifyKhaltiPayment = async (req, res) => {
  try {
    const khaltiVerifyUrl = getRequiredEnv("KHALTI_VERIFY_URL");
    const khaltiSecretKey = getRequiredEnv("KHALTI_SECRET_KEY");
    const { orderId, pidx } = req.body;

    if (!orderId || !pidx) {
      return res.status(400).json({ message: "orderId and pidx are required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Payment already processed" });
    }

    const existingPaymentWithPidx = await Order.findOne({
      _id: { $ne: order._id },
      khaltiPidx: pidx,
    });

    if (existingPaymentWithPidx) {
      return res.status(400).json({ message: "Transaction pidx already used" });
    }

    const response = await fetch(khaltiVerifyUrl, {
      method: "POST",
      headers: {
        Authorization: `Key ${khaltiSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    });

    if (!response.ok) {
      return res.status(400).json({ message: "Khalti verification failed" });
    }

    const verificationResult = await response.json();
    const statusValue =
      verificationResult?.status || verificationResult?.state?.name;
    if (statusValue !== "Completed") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const verifiedAmount = Number(verificationResult?.total_amount || 0) / 100;
    if (!amountsEqual(verifiedAmount, Number(order.totalAmount))) {
      return res.status(400).json({ message: "Payment amount mismatch" });
    }

    if (
      verificationResult?.purchase_order_id &&
      String(verificationResult.purchase_order_id) !== String(orderId)
    ) {
      return res.status(400).json({ message: "Payment order mismatch" });
    }

    const updateResult = await Order.updateOne(
      {
        _id: order._id,
        paymentStatus: { $ne: "paid" },
        khaltiPidx: null,
      },
      {
        $set: {
          paymentStatus: "paid",
          orderStatus: "confirmed",
          khaltiPidx: pidx,
          paymentReference: verificationResult?.transaction_id || pidx,
        },
      },
    );

    if (updateResult.modifiedCount === 0) {
      return res
        .status(400)
        .json({ message: "Payment has already been processed" });
    }

    return res
      .status(200)
      .json({ message: "Khalti payment verified", orderId });
  } catch (error) {
    console.error("verifyKhaltiPayment error:", error);
    return res.status(500).json({ message: "Failed to verify Khalti payment" });
  }
};

export {
  initiateEsewaPayment,
  initiateKhaltiPayment,
  handleEsewaSuccess,
  handleEsewaFailure,
  verifyKhaltiPayment,
};
