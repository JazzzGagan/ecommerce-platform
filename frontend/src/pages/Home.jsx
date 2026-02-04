import { useEffect, useState } from "react";
import HeroSlider from "../components/HeroSlider";
import BrandLogos from "../components/BrandLogos";
import FeaturedCategories from "../components/FeaturedCategories";
import ProductSection from "../components/ProductSection";
import ProductSlider from "../components/ProductSlider";
import API from "../api/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await API.get("/products");
        setProducts(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <HeroSlider />
      <BrandLogos />
      <FeaturedCategories />
      <ProductSection />
      {!loading && !error && products.length > 0 && (
        <ProductSlider products={products} title="Featured Products" />
      )}
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            fontSize: "18px",
            color: "#666",
          }}
        >
          Loading products...
        </div>
      )}
      {error && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            fontSize: "18px",
            color: "#e74c3c",
          }}
        >
          {error}
        </div>
      )}
    </>
  );
};

export default Home;
