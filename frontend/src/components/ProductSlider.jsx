import { useState } from "react";
import "./ProductSlider.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ProductSlider = ({ products, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 4;
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const totalSlides = Math.ceil(products.length / itemsPerView);

  const nextSlide = () => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const getVisibleProducts = () => {
    const start = currentIndex * itemsPerView;
    return products.slice(start, start + itemsPerView);
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/" } } });
      return;
    }
    addToCart(product, 1);
  };

  const handleOpenProduct = (product) => {
    if (product?._id) {
      navigate(`/product/${product._id}`);
    }
  };

  return (
    <section className="product-slider-section">
      <div className="container">
        {title && <h2 className="slider-section-title">{title}</h2>}
        <div className="slider-wrapper">
          <button
            className={`slider-nav-btn prev-btn ${currentIndex === 0 ? "disabled" : ""}`}
            onClick={prevSlide}
            disabled={currentIndex === 0}
            aria-label="Previous slide"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="slider-container">
            <div
              className="slider-track"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="slide-group">
                  {products
                    .slice(
                      slideIndex * itemsPerView,
                      slideIndex * itemsPerView + itemsPerView,
                    )
                    .map((product, productIndex) => (
                      <div key={productIndex} className="product-slide-card">
                        <div
                          className="product-slide-image"
                          onClick={() => handleOpenProduct(product)}
                          style={{
                            cursor: product?._id ? "pointer" : "default",
                          }}
                        >
                          <img
                            src={
                              product.image ||
                              `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80&auto=format`
                            }
                            alt={product.name}
                            loading="lazy"
                          />
                        </div>
                        <div className="product-slide-info">
                          <h3
                            className="product-slide-name"
                            onClick={() => handleOpenProduct(product)}
                            title={product.name}
                            style={{
                              cursor: product?._id ? "pointer" : "default",
                            }}
                          >
                            {product.name}
                          </h3>
                          <div className="product-slide-price">
                            <span className="slide-current-price">
                              रु {product.price}
                            </span>
                          </div>
                          <button
                            className="add-to-cart-btn"
                            onClick={() => handleAddToCart(product)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          <button
            className={`slider-nav-btn next-btn ${currentIndex === totalSlides - 1 ? "disabled" : ""}`}
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <div className="slider-dots">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;
