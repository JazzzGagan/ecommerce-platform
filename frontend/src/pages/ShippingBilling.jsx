import { useEffect, useRef, useState } from "react";
import "./ShippingBilling.css";
import esewaLogo from "../assets/logoPayment/Esewa.png";
import khaltiLogo from "../assets/logoPayment/khalti.png";
import fonepayLogo from "../assets/logoPayment/fonepay.png";
import { useCart } from "../context/CartContext.jsx";
import API from "../api/api.js";
import { useLocation, useNavigate } from "react-router-dom";

const ShippingBilling = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const hasHandledSuccessfulPayment = useRef(false);

  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    country: "Nepal",
    address: "",
    building: "",
    city: "",
    zone: "",
    zip: "",
  });

  const [billing, setBilling] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    country: "Nepal",
    address: "",
    building: "",
    city: "",
    zone: "",
    zip: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [useSeparateBilling, setUseSeparateBilling] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleBillingChange = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

  const shippingCost = total > 0 ? 0 : 0;
  const discountAmount = Number(appliedCoupon?.discountAmount || 0);
  const grandTotal = Math.max(total + shippingCost - discountAmount, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const formatNpr = (amount) => `रु ${Number(amount || 0).toFixed(2)}`;
  const query = new URLSearchParams(location.search);
  const paymentStatus = query.get("payment");
  const paymentMethodQuery = query.get("method");
  const khaltiPidx = query.get("pidx");
  const khaltiOrderId = query.get("orderId") || query.get("purchase_order_id");

  useEffect(() => {
    const verifyKhalti = async () => {
      if (paymentMethodQuery !== "khalti" || !khaltiPidx || !khaltiOrderId)
        return;
      try {
        await API.post("/orders/khalti/verify", {
          orderId: khaltiOrderId,
          pidx: khaltiPidx,
        });

        if (!hasHandledSuccessfulPayment.current) {
          clearCart();
          hasHandledSuccessfulPayment.current = true;
        }

        navigate(
          `/shipping-billing-address?payment=success&method=khalti&orderId=${khaltiOrderId}`,
          { replace: true },
        );
      } catch (error) {
        console.error("Khalti verification failed:", error);
        navigate(
          `/shipping-billing-address?payment=failed&method=khalti&orderId=${khaltiOrderId || ""}`,
          { replace: true },
        );
      }
    };

    verifyKhalti();
  }, [paymentMethodQuery, khaltiPidx, khaltiOrderId, clearCart, navigate]);

  useEffect(() => {
    if (paymentStatus !== "success") return;
    if (hasHandledSuccessfulPayment.current) return;

    clearCart();
    hasHandledSuccessfulPayment.current = true;
  }, [paymentStatus, clearCart]);

  const isAddressComplete = (address) =>
    Boolean(
      address.firstName &&
      address.lastName &&
      address.phone &&
      address.country &&
      address.address &&
      address.city,
    );

  const handleNext = async () => {
    if (paymentMethod === "fonepay") {
      navigate("/checkout");
      return;
    }

    if (!isAddressComplete(shipping)) {
      alert("Please complete all required shipping address fields.");
      return;
    }

    if (useSeparateBilling && !isAddressComplete(billing)) {
      alert("Please complete all required billing address fields.");
      return;
    }

    if (!items.length || grandTotal <= 0) {
      alert("Your cart is empty. Please add items before payment.");
      return;
    }

    try {
      setIsProcessingPayment(true);

      const normalizedItems = items
        .map((item) => ({
          productId:
            item.productId || item._id || item.id || item.product?._id || "",
          name: item.name || item.title || item.productName || "",
          price: Number(item.price ?? item.unitPrice ?? 0),
          quantity: Number(item.quantity ?? item.qty ?? 0),
          image: item.image || item.thumbnail || item.images?.[0] || "",
        }))
        .filter((item) => item.productId && item.name && item.quantity > 0);

      if (!normalizedItems.length) {
        alert(
          "Your cart data is invalid. Please refresh the cart and try again.",
        );
        return;
      }

      const payload = {
        amount: grandTotal,
        items: normalizedItems,
        shippingAddress: shipping,
        billingAddress: useSeparateBilling ? billing : shipping,
        paymentMethod,
        couponCode: appliedCoupon?.code || "",
      };

      if (paymentMethod === "khalti") {
        const response = await API.post("/orders/khalti/initiate", payload);
        const { paymentUrl } = response.data;
        if (!paymentUrl) {
          throw new Error("Invalid Khalti payment response");
        }
        window.location.href = paymentUrl;
        return;
      }

      const response = await API.post("/orders/esewa/initiate", payload);
      const { paymentUrl, esewaConfig } = response.data;

      if (!paymentUrl || !esewaConfig) {
        throw new Error("Invalid eSewa payment session response");
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentUrl;

      Object.entries(esewaConfig).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value ?? "");
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Failed to initiate payment:", error);

      if (error?.response?.status === 401) {
        alert("Session expired. Please log in again to continue checkout.");
        return;
      }

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to start payment. Please try again.";
      alert(backendMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleApplyCoupon = async () => {
    const normalizedCode = couponCode.trim().toUpperCase();

    if (!normalizedCode) {
      alert("Please enter a coupon code.");
      return;
    }

    if (!items.length || total <= 0) {
      alert("Add items to your cart before applying a coupon.");
      return;
    }

    try {
      setIsApplyingCoupon(true);
      const response = await API.post("/coupons/validate", {
        code: normalizedCode,
        amount: total + shippingCost,
      });

      setAppliedCoupon(response.data);
      setCouponCode(response.data?.code || normalizedCode);
      alert(
        `Coupon ${response.data?.code || normalizedCode} applied successfully.`,
      );
    } catch (error) {
      setAppliedCoupon(null);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to apply coupon.";
      alert(message);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <div className="shipping-page">
      {paymentStatus === "success" && (
        <div className="section-card" style={{ borderColor: "#86efac" }}>
          <p style={{ color: "#166534", fontWeight: 600 }}>
            Payment completed successfully.
          </p>
        </div>
      )}
      {paymentStatus === "failed" && (
        <div className="section-card" style={{ borderColor: "#fca5a5" }}>
          <p style={{ color: "#991b1b", fontWeight: 600 }}>
            Payment failed or cancelled. Please try again.
          </p>
        </div>
      )}

      {/* Steps */}
      <div className="shipping-steps">
        <div className="step-item active">
          <span className="step-dot">1</span>
          <span className="step-label">Shipping & Billing Address</span>
        </div>
        <div className="step-line" />
        <div className="step-item">
          <span className="step-dot">2</span>
          <span className="step-label">Shipping Method</span>
        </div>
        <div className="step-line" />
        <div className="step-item">
          <span className="step-dot">3</span>
          <span className="step-label">Payment</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="shipping-layout">
        {/* Left Form */}
        <section className="shipping-left">
          {/* Shipping Info */}
          <div className="section-card">
            <h2 className="text-xl font-semibold">Shipping Address</h2>
            <div className="form-stack">
              {/* First Name + Last Name */}
              <div className="form-row-2">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={shipping.firstName}
                  onChange={handleShippingChange}
                  className="form-field"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={shipping.lastName}
                  onChange={handleShippingChange}
                  className="form-field"
                />
              </div>

              {/* Phone + Country */}
              <div className="form-row-2">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={shipping.phone}
                  onChange={handleShippingChange}
                  className="form-field"
                />
                <select
                  name="country"
                  value={shipping.country}
                  onChange={handleShippingChange}
                  className="form-field"
                >
                  <option value="Nepal">NP Nepal</option>
                  <option value="USA">USA</option>
                  <option value="India">India</option>
                </select>
              </div>

              {/* Address (full width) */}
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={shipping.address}
                onChange={handleShippingChange}
                className="form-field"
              />

              <input
                type="text"
                name="building"
                placeholder="Building / Apartment"
                value={shipping.building}
                onChange={handleShippingChange}
                className="form-field"
              />

              {/* City + Zone + Zip */}
              <div className="form-row-3">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shipping.city}
                  onChange={handleShippingChange}
                  className="form-field"
                />
                <select
                  name="zone"
                  value={shipping.zone}
                  onChange={handleShippingChange}
                  className="form-field"
                >
                  <option value="">Select Zone</option>
                  <option value="Bagmati">Bagmati</option>
                  <option value="Gandaki">Gandaki</option>
                  <option value="Lumbini">Lumbini</option>
                  <option value="Koshi">Koshi</option>
                </select>
                <input
                  type="text"
                  name="zip"
                  placeholder="Zip Code"
                  value={shipping.zip}
                  onChange={handleShippingChange}
                  className="form-field"
                />
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="billing-toggle">
              <p className="billing-toggle-text">
                Billing address is same as shipping.
              </p>
              <button
                type="button"
                className="outline-btn"
                onClick={() => setUseSeparateBilling((prev) => !prev)}
              >
                {useSeparateBilling
                  ? "Use shipping as billing"
                  : "Add separate billing address"}
              </button>
            </div>
          </div>

          {/* Billing Info */}
          {useSeparateBilling && (
            <div className="section-card">
              <h2>Billing Address</h2>
              <div className="form-stack">
                <div className="form-row-2">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={billing.firstName}
                    onChange={handleBillingChange}
                    className="form-field"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={billing.lastName}
                    onChange={handleBillingChange}
                    className="form-field"
                  />
                </div>
                <div className="form-row-2">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={billing.phone}
                    onChange={handleBillingChange}
                    className="form-field"
                  />
                  <select
                    name="country"
                    value={billing.country}
                    onChange={handleBillingChange}
                    className="form-field"
                  >
                    <option value="Nepal">NP Nepal</option>
                    <option value="USA">USA</option>
                    <option value="India">India</option>
                  </select>
                </div>
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={billing.address}
                  onChange={handleBillingChange}
                  className="form-field"
                />
                <input
                  type="text"
                  name="building"
                  placeholder="Building / Apartment"
                  value={billing.building}
                  onChange={handleBillingChange}
                  className="form-field"
                />
                <div className="form-row-3">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={billing.city}
                    onChange={handleBillingChange}
                    className="form-field"
                  />
                  <select
                    name="zone"
                    value={billing.zone}
                    onChange={handleBillingChange}
                    className="form-field"
                  >
                    <option value="">Select Zone</option>
                    <option value="Bagmati">Bagmati</option>
                    <option value="Gandaki">Gandaki</option>
                    <option value="Lumbini">Lumbini</option>
                    <option value="Koshi">Koshi</option>
                  </select>
                  <input
                    type="text"
                    name="zip"
                    placeholder="Zip Code"
                    value={billing.zip}
                    onChange={handleBillingChange}
                    className="form-field"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="section-card">
            <h2>Payment Method</h2>
            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="esewa"
                  checked={paymentMethod === "esewa"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <img src={esewaLogo} alt="eSewa" className="payment-logo" />
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="khalti"
                  checked={paymentMethod === "khalti"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <img src={khaltiLogo} alt="Khalti" className="payment-logo" />
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="fonepay"
                  checked={paymentMethod === "fonepay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <img
                  src={fonepayLogo}
                  alt="Fonepay"
                  className="payment-logo payment-logo-fonepay"
                />
              </label>
            </div>
          </div>

          {/* Next Button */}
          <div className="section-actions">
            <button
              className="primary-btn"
              type="button"
              onClick={handleNext}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? "Processing..." : "Next"}
            </button>
          </div>
        </section>

        {/* Right Summary */}
        <aside className="shipping-summary">
          <div className="summary-card">
            <div className="summary-header">
              <h3>ORDER SUMMARY</h3>
              <button type="button" className="link-btn">
                Edit
              </button>
            </div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatNpr(total)}</span>
            </div>
            <div className="summary-row">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="summary-row">
              <span>Shipping (Free Shipping)</span>
              <span>{formatNpr(shippingCost)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Date (1-3 working Days)</span>
              <span>Estimated</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Grand total</span>
              <span>{formatNpr(grandTotal)}</span>
            </div>
            {appliedCoupon && (
              <div className="summary-row" style={{ color: "#166534" }}>
                <span>
                  Coupon ({appliedCoupon.code})
                  {appliedCoupon.discountType === "percentage"
                    ? ` - ${appliedCoupon.discountValue}%`
                    : ""}
                </span>
                <span>- {formatNpr(appliedCoupon.discountAmount)}</span>
              </div>
            )}
            <div className="summary-coupon">
              <input
                type="text"
                placeholder="Enter discount code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={isApplyingCoupon}
              >
                {isApplyingCoupon ? "Applying..." : "Apply now"}
              </button>
            </div>
            {appliedCoupon && (
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setAppliedCoupon(null);
                  setCouponCode("");
                }}
              >
                Remove coupon
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ShippingBilling;
