import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api";
import ProductCard from "../components/ProductCard.jsx";
import "./CategoryProducts.css";

const CategoryProducts = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all categories to find the one with matching slug
        const categoriesRes = await API.get("/categories");
        const foundCategory = categoriesRes.data.find(
          (cat) =>
            cat.slug === slug ||
            cat.name.toLowerCase().replace(/\s+/g, "-") === slug,
        );

        if (!foundCategory) {
          setError("Category not found");
          setLoading(false);
          return;
        }

        setCategory(foundCategory);

        // Fetch all products
        const productsRes = await API.get("/products");

        // Filter products that belong to this category
        const categoryProducts = productsRes.data.filter(
          (product) =>
            product.category?._id === foundCategory._id ||
            product.category === foundCategory._id,
        );

        setProducts(categoryProducts);
      } catch (err) {
        console.error("Error fetching category products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="category-products-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-products-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="category-products-container">
      <div className="category-header">
        <h1>{category?.name}</h1>
        <p className="products-count">{products.length} products found</p>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <p>No products found in this category.</p>
          <Link to="/" className="back-home-btn">
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
