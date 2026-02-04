import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`);
        console.log("Product data:", res.data);
        console.log("Images array:", res.data?.images);
        setProduct(res.data);
        const firstImage = res.data?.images?.[0] || res.data?.image || "";
        console.log("First image URL:", firstImage);
        setActiveImage(firstImage);
        setQuantity(res.data?.quantity > 0 ? 1 : 0);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load product details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const inStock = useMemo(() => {
    return (product?.quantity || 0) > 0;
  }, [product]);

  const handleIncrease = () => {
    if (!product || !inStock) return;
    setQuantity((prev) => Math.min(prev + 1, product.quantity || 0));
  };

  const handleDecrease = () => {
    if (!inStock) return;
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    // TODO: connect cart API
  };

  if (loading) {
    return <div className="product-detail loading">Loading product...</div>;
  }

  if (error) {
    return <div className="product-detail error">{error}</div>;
  }

  if (!product) {
    return <div className="product-detail error">Product not found.</div>;
  }

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <div className="product-gallery">
          <div className="main-image">
            <img
              src={
                activeImage ||
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&q=80&auto=format"
              }
              alt={product.name}
              onError={(e) => {
                console.error("Image failed to load:", e.target.src);
                e.target.src =
                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&q=80&auto=format";
              }}
            />
          </div>
          {product.images?.length > 0 && (
            <div className="thumbnail-row">
              {product.images.map((img, idx) => (
                <button
                  type="button"
                  key={img + idx}
                  className={`thumbnail ${activeImage === img ? "active" : ""}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    onError={(e) => {
                      console.error("Thumbnail failed to load:", e.target.src);
                      e.target.src =
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80&auto=format";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info-panel">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-category">
            {product.category?.name || "Uncategorized"}
          </p>

          <div className="product-price-row">
            <span className="product-price">₹ {product.price}</span>
            <span className={`stock-badge ${inStock ? "in" : "out"}`}>
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {product.brand && (
            <p className="product-brand">Brand: {product.brand}</p>
          )}

          <div className="product-description">
            {product.description || "No description available."}
          </div>

          <div className="quantity-row">
            <span>Quantity</span>
            <div className="quantity-control">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={!inStock}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={handleIncrease}
                disabled={!inStock}
              >
                +
              </button>
            </div>
            <span className="available-qty">
              Available: {product.quantity || 0}
            </span>
          </div>

          <button
            type="button"
            className="add-to-cart primary"
            onClick={handleAddToCart}
            disabled={!inStock}
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
