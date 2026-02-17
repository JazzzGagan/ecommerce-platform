import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart, updateQuantity, removeFromCart } = useCart();

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    clearCart();
    navigate("/");
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          Your cart is empty. Add items to continue checkout.
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
      </div>

      <div className="checkout-layout">
        <section className="checkout-products">
          <div className="checkout-products-title">Your Products</div>
          <div className="checkout-product-list">
            {items.map((item) => (
              <div key={item.productId} className="checkout-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="checkout-item-image"
                />
                <div className="checkout-item-content">
                  <div className="checkout-item-head">
                    <div className="checkout-item-name">{item.name}</div>
                    <button
                      type="button"
                      className="checkout-remove-btn"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="checkout-item-foot">
                    <div className="checkout-item-price">
                      Price: रु {item.price}
                    </div>
                    <label className="checkout-qty-label">
                      Qty
                      <select
                        className="checkout-qty-select"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.productId, Number(e.target.value))
                        }
                      >
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(
                          (qty) => (
                            <option key={qty} value={qty}>
                              {qty}
                            </option>
                          ),
                        )}
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="checkout-summary">
          <div className="summary-title">Summary</div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>रु {total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row summary-note">
            <span>Delivery Date</span>
            <span>1-3 working Days</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Grand Total</span>
            <span>रु {total.toFixed(2)}</span>
          </div>
          <button
            type="button"
            onClick={handlePlaceOrder}
            className="summary-checkout"
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
