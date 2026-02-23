import { useState } from "react";
import "./ShippingBilling.css";

const ShippingBilling = () => {
  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  return (
    <div className="shipping-page">
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

      <div className="shipping-layout">
        <section className="shipping-left">
          <div className="section-card">
            <h2>Shipping address</h2>
            {shippingAddress ? (
              <p className="address-text">{shippingAddress}</p>
            ) : (
              <p className="empty-text">
                There is no address yet. Please create new address to continue.
              </p>
            )}
            <button className="outline-btn" type="button">
              Add new address
            </button>
          </div>

          <div className="section-card">
            <h2>Billing address</h2>
            {billingAddress ? (
              <p className="address-text">{billingAddress}</p>
            ) : (
              <p className="empty-text">
                There is no address yet. Please create new address to continue.
              </p>
            )}
            <button className="outline-btn outline-danger" type="button">
              Add new address
            </button>
          </div>

          <div className="section-actions">
            <button className="primary-btn" type="button">
              Next
            </button>
          </div>
        </section>

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
              <span>रु 0</span>
            </div>
            <div className="summary-row">
              <span>Shipping (Free Shipping)</span>
              <span>रु 0</span>
            </div>
            <div className="summary-row">
              <span>Delivery Date (1-3 working Days)</span>
              <span>रु 0</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Grand total</span>
              <span>रु 0</span>
            </div>

            <div className="summary-coupon">
              <input type="text" placeholder="Enter discount code" />
              <button type="button">Apply now</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ShippingBilling;
