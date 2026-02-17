import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import "./Cart.css";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-overlay">
        <Link to="/" className="cart-backdrop" aria-label="Close cart" />
        <aside className="cart-drawer">
          <div className="cart-header">
            <h1>Your Cart</h1>
            <Link to="/" className="cart-close" aria-label="Close cart">
              ×
            </Link>
          </div>
          <div className="cart-page">
            <p className="cart-empty">Your cart is empty.</p>
            <Link to="/" className="cart-cta">
              Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="cart-overlay">
      <Link to="/" className="cart-backdrop" aria-label="Close cart" />
      <aside className="cart-drawer">
        <div className="cart-header">
          <h1>Your Cart</h1>
          <Link to="/" className="cart-close" aria-label="Close cart">
            ×
          </Link>
        </div>
        <div className="cart-page">
          <div className="cart-layout">
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.productId} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-thumb"
                  />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>${item.price}</p>
                    <div className="cart-qty">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <span className="cart-item-total">
                      ${(Number(item.price || 0) * item.quantity).toFixed(2)}
                    </span>
                    <button
                      className="cart-remove"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h2>Summary</h2>
              <div className="cart-summary-row">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="cart-checkout">
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Cart;
