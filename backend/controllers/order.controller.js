import crypto from "crypto";
import Order from "../models/order.model.js";
import Coupon from "../models/coupon.model.js";
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

const isPlaceholderKhaltiKey = (value) =>
  !value || /replace_with_your_khalti_secret_key/i.test(String(value));

const normalizeBaseUrl = (value) => String(value || "").replace(/\/+$/, "");
const normalizeCouponCode = (value) =>
  String(value || "")
    .trim()
    .toUpperCase();

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

const getOrderSubtotal = (items = []) => {
  return Number(
    items
      .reduce((sum, item) => {
        return sum + Number(item.price || 0) * Number(item.quantity || 0);
      }, 0)
      .toFixed(2),
  );
};

const getDiscountAmount = ({ discountType, discountValue, subtotal }) => {
  if (!subtotal || subtotal <= 0) return 0;

  if (discountType === "percentage") {
    return Math.min((subtotal * Number(discountValue || 0)) / 100, subtotal);
  }

  return Math.min(Number(discountValue || 0), subtotal);
};

const resolveCouponForOrder = async ({ couponCode, subtotal }) => {
  const normalizedCode = normalizeCouponCode(couponCode);

  if (!normalizedCode) {
    return {
      couponCode: "",
      discountType: "",
      discountValue: 0,
      discountAmount: 0,
    };
  }

  const coupon = await Coupon.findOne({ code: normalizedCode });

  if (!coupon || !coupon.isActive) {
    const error = new Error("Invalid coupon code");
    error.statusCode = 400;
    throw error;
  }

  if (new Date(coupon.expiresAt).getTime() < Date.now()) {
    const error = new Error("Coupon has expired");
    error.statusCode = 400;
    throw error;
  }

  const discountAmount = Number(
    getDiscountAmount({
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      subtotal,
    }).toFixed(2),
  );

  return {
    couponCode: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount,
  };
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
      "http://localhost:3000",
    );
    const frontendBaseUrl = normalizeBaseUrl(
      getEnvOrDefault("FRONTEND_BASE_URL", "http://localhost:5173"),
    );

    const {
      items = [],
      shippingAddress,
      billingAddress,
      paymentMethod = "esewa",
      couponCode = "",
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

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const subtotal = getOrderSubtotal(normalizedItems);
    const shippingCost = 0;

    if (subtotal <= 0) {
      return res.status(400).json({ message: "Invalid order subtotal" });
    }

    const couponMeta = await resolveCouponForOrder({ couponCode, subtotal });
    const finalAmount = Number(
      (subtotal + shippingCost - couponMeta.discountAmount).toFixed(2),
    );

    if (finalAmount <= 0) {
      return res.status(400).json({
        message:
          "Invalid final amount after discount. Please check coupon settings.",
      });
    }

    const transactionUuid = `${Date.now()}-${crypto.randomUUID()}`;
    const esewaTransactionUuid = transactionUuid;
    const normalizedAmount = Number(finalAmount).toFixed(2);

    const order = await Order.create({
      user: req.authUser._id,
      items: normalizedItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      subtotal,
      couponCode: couponMeta.couponCode,
      discountType: couponMeta.discountType,
      discountValue: couponMeta.discountValue,
      discountAmount: couponMeta.discountAmount,
      shippingCost,
      totalAmount: finalAmount,
      paymentStatus: "pending",
      orderStatus: "pending",
      transactionUuid,
      esewaTransactionUuid,
    });

    const signedFieldNames = "total_amount,transaction_uuid,product_code";
    const signatureString = buildEsewaSignatureString({
      totalAmount: normalizedAmount,
      transactionUuid,
      productCode: esewaProductCode,
    });

    const signature = generateEsewaSignature(esewaSecretKey, signatureString);

    const successUrl = `${backendBaseUrl}/api/orders/esewa/success/${order._id}`;
    const failureUrl = `${backendBaseUrl}/api/orders/esewa/failure/${order._id}`;

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
      subtotal,
      discountAmount: couponMeta.discountAmount,
      finalAmount,
      paymentUrl: `${esewaBaseUrl}/api/epay/main/v2/form`,
      esewaConfig,
    });
  } catch (error) {
    console.error("initiateEsewaPayment error:", error);
    if (error?.code === 11000) {
      return res.status(409).json({
        message: "Duplicate payment transaction detected. Please retry.",
      });
    }
    if (error?.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid order data",
        error: error?.message,
      });
    }
    if (error?.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
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

    if (isPlaceholderKhaltiKey(khaltiSecretKey)) {
      return res.status(500).json({
        message:
          "KHALTI_SECRET_KEY is missing or still using the default placeholder",
      });
    }

    const {
      items = [],
      shippingAddress,
      billingAddress,
      paymentMethod = "khalti",
      couponCode = "",
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

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const subtotal = getOrderSubtotal(normalizedItems);
    const shippingCost = 0;

    if (subtotal <= 0) {
      return res.status(400).json({ message: "Invalid order subtotal" });
    }

    const couponMeta = await resolveCouponForOrder({ couponCode, subtotal });
    const finalAmount = Number(
      (subtotal + shippingCost - couponMeta.discountAmount).toFixed(2),
    );

    if (finalAmount <= 0) {
      return res.status(400).json({
        message:
          "Invalid final amount after discount. Please check coupon settings.",
      });
    }

    const pendingKhaltiPidx = `pending-${Date.now()}-${crypto.randomUUID()}`;

    const order = await Order.create({
      user: req.authUser._id,
      items: normalizedItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      subtotal,
      couponCode: couponMeta.couponCode,
      discountType: couponMeta.discountType,
      discountValue: couponMeta.discountValue,
      discountAmount: couponMeta.discountAmount,
      shippingCost,
      totalAmount: finalAmount,
      paymentStatus: "pending",
      orderStatus: "pending",
      transactionUuid: `${Date.now()}-${crypto.randomUUID()}`,
      khaltiPidx: pendingKhaltiPidx,
    });

    const khaltiPayload = {
      return_url: `${frontendBaseUrl}/shipping-billing-address?method=khalti&orderId=${order._id}`,
      website_url: frontendBaseUrl,
      amount: Math.round(Number(finalAmount) * 100),
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

      let providerMessage = errorBody;
      try {
        const parsed = JSON.parse(errorBody);
        providerMessage =
          parsed?.detail || parsed?.message || JSON.stringify(parsed);
      } catch {
        // Keep raw response if it is not JSON.
      }

      return res.status(400).json({
        message: "Failed to initiate Khalti payment",
        error: providerMessage,
      });
    }

    const data = await response.json();

    return res.status(201).json({
      message: "Khalti payment initiated",
      orderId: order._id,
      subtotal,
      discountAmount: couponMeta.discountAmount,
      finalAmount,
      paymentUrl: data.payment_url,
      pidx: data.pidx,
    });
  } catch (error) {
    console.error("initiateKhaltiPayment error:", error);
    if (error?.code === 11000) {
      return res.status(409).json({
        message: "Duplicate payment transaction detected. Please retry.",
      });
    }
    if (error?.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid order data",
        error: error?.message,
      });
    }
    if (error?.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
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
    const frontendBaseUrl = normalizeBaseUrl(
      getEnvOrDefault("FRONTEND_BASE_URL", "http://localhost:5173"),
    );
    const orderId = req.params.orderId || req.query.orderId;

    if (!orderId) {
      return res.status(400).send("Missing orderId");
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send("Order not found");
    }

    if (order.paymentStatus === "paid") {
      return res.redirect(
        `${frontendBaseUrl}/shipping-billing-address?payment=success&orderId=${order._id}`,
      );
    }

    const encodedData = req.query.data;
    if (!encodedData) {
      return res.redirect(
        `${frontendBaseUrl}/shipping-billing-address?payment=failed&orderId=${order._id}`,
      );
    }

    let decodedData;
    try {
      const decodedJson = Buffer.from(encodedData, "base64").toString("utf8");
      decodedData = JSON.parse(decodedJson);
    } catch (error) {
      console.error("Failed to decode eSewa callback data:", error);
      return res.redirect(
        `${frontendBaseUrl}/shipping-billing-address?payment=failed&orderId=${order._id}`,
      );
    }

    if (decodedData?.status !== "COMPLETE") {
      order.paymentStatus = "failed";
      await order.save();
      return res.redirect(
        `${frontendBaseUrl}/shipping-billing-address?payment=failed&orderId=${order._id}`,
      );
    }

    if (decodedData?.transaction_uuid !== order.transactionUuid) {
      order.paymentStatus = "failed";
      await order.save();
      return res.redirect(
        `${frontendBaseUrl}/shipping-billing-address?payment=failed&orderId=${order._id}`,
      );
    }

    const decodedAmount = Number(decodedData?.total_amount || 0);
    if (!amountsEqual(decodedAmount, Number(order.totalAmount))) {
      order.paymentStatus = "failed";
      await order.save();
      return res.redirect(
        `${frontendBaseUrl}/shipping-billing-address?payment=failed&orderId=${order._id}`,
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
        `${frontendBaseUrl}/shipping-billing-address?payment=failed&orderId=${order._id}`,
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
          `${frontendBaseUrl}/shipping-billing-address?payment=failed&orderId=${order._id}`,
        );
      }

      const updateResult = await Order.updateOne(
        {
          _id: order._id,
          paymentStatus: { $ne: "paid" },
          esewaTransactionUuid: order.transactionUuid,
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
          `${frontendBaseUrl}/shipping-billing-address?payment=failed&orderId=${order._id}`,
        );
      }

      return res.redirect(
        `${frontendBaseUrl}/shipping-billing-address?payment=success&orderId=${order._id}`,
      );
    }

    order.paymentStatus = "failed";
    await order.save();
    return res.redirect(
      `${frontendBaseUrl}/shipping-billing-address?payment=failed&orderId=${order._id}`,
    );
  } catch (error) {
    console.error("handleEsewaSuccess error:", error);
    return res.status(500).send("Payment verification failed");
  }
};

const handleEsewaFailure = async (req, res) => {
  try {
    const frontendBaseUrl = normalizeBaseUrl(
      getEnvOrDefault("FRONTEND_BASE_URL", "http://localhost:5173"),
    );
    const orderId = req.params.orderId || req.query.orderId;

    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = "failed";
        order.orderStatus = "cancelled";
        await order.save();
      }
    }

    return res.redirect(
      `${frontendBaseUrl}/shipping-billing-address?payment=failed${orderId ? `&orderId=${orderId}` : ""}`,
    );
  } catch (error) {
    console.error("handleEsewaFailure error:", error);
    return res.status(500).send("Failed to process payment failure");
  }
};

const verifyKhaltiPayment = async (req, res) => {
  try {
    const khaltiVerifyUrl = getRequiredEnv("KHALTI_VERIFY_URL");
    const khaltiSecretKey = getEnvOrDefault("KHALTI_SECRET_KEY", "");
    const { orderId, pidx } = req.body;

    if (isPlaceholderKhaltiKey(khaltiSecretKey)) {
      return res.status(500).json({
        message:
          "KHALTI_SECRET_KEY is missing or still using the default placeholder",
      });
    }

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
      const errorBody = await response.text();
      let providerMessage = errorBody;
      try {
        const parsed = JSON.parse(errorBody);
        providerMessage =
          parsed?.detail || parsed?.message || JSON.stringify(parsed);
      } catch {
        // Keep raw response if it is not JSON.
      }

      return res.status(400).json({
        message: "Khalti verification failed",
        error: providerMessage,
      });
    }

    const verificationResult = await response.json();
    const statusValue =
      verificationResult?.status || verificationResult?.state?.name;
    if (String(statusValue || "").toLowerCase() !== "completed") {
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
        khaltiPidx: { $ne: pidx },
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

const getAdminOrders = async (req, res) => {
  try {
    const { paymentMethod, paymentStatus, orderStatus, q } = req.query;

    const filters = {};

    if (paymentMethod) {
      filters.paymentMethod = paymentMethod;
    }

    if (paymentStatus) {
      filters.paymentStatus = paymentStatus;
    }

    if (orderStatus) {
      filters.orderStatus = orderStatus;
    }

    if (q) {
      filters.$or = [
        { paymentReference: { $regex: q, $options: "i" } },
        { transactionUuid: { $regex: q, $options: "i" } },
      ];
    }

    const orders = await Order.find(filters)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(orders);
  } catch (error) {
    console.error("getAdminOrders error:", error);
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const updateAdminOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    return res.status(200).json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("updateAdminOrderStatus error:", error);
    return res.status(500).json({ message: "Failed to update order status" });
  }
};

export {
  initiateEsewaPayment,
  initiateKhaltiPayment,
  handleEsewaSuccess,
  handleEsewaFailure,
  verifyKhaltiPayment,
  getAdminOrders,
  updateAdminOrderStatus,
};
