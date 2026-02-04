import "./ProductSection.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProductSection = ({ title = "Products", products = [], viewAllLink }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/" } } });
      return;
    }
    // TODO: implement add-to-cart logic
  };

  const handleOpenProduct = (product) => {
    if (product?._id) {
      navigate(`/product/${product._id}`);
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="product-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          {viewAllLink && (
            <a href={viewAllLink} className="view-all-link">
              View all
            </a>
          )}
        </div>
        <div className="products-grid">
          {products.map((product, index) => (
            <div key={index} className="product-card">
              <div
                className="product-image"
                onClick={() => handleOpenProduct(product)}
                style={{ cursor: product?._id ? "pointer" : "default" }}
              >
                <img
                  src={
                    product.image ||
                    `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80&auto=format`
                  }
                  alt={product.name}
                  loading="lazy"
                />
                <button className="wishlist-icon" aria-label="Add to wishlist">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>
              <div className="product-info">
                <h3
                  className="product-name"
                  onClick={() => handleOpenProduct(product)}
                  style={{ cursor: product?._id ? "pointer" : "default" }}
                >
                  {product.name}
                </h3>
                <div className="product-rating">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`star ${i < (product.rating || 0) ? "filled" : ""}`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="rating-count">({product.reviews || 0})</span>
                </div>
                <div className="product-price">
                  {product.originalPrice && (
                    <span className="original-price">
                      {product.originalPrice}
                    </span>
                  )}
                  <span className="current-price">{product.price}</span>
                </div>
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
