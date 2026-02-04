import { useEffect, useState } from "react";
import ProductSlider from "../components/ProductSlider";
import ProductSection from "../components/ProductSection";
import API from "../api/api";

const Accessories = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          paddingTop: "120px",
          minHeight: "100vh",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          paddingTop: "120px",
          minHeight: "100vh",
          textAlign: "center",
          padding: "2rem",
          color: "#e53e3e",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "120px", minHeight: "100vh" }}>
      {products.length > 0 ? (
        <>
          <ProductSlider products={products} title="All Products" />
          <ProductSection products={products} title="Featured Products" />
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          No products available
        </div>
      )}
    </div>
  );
};

export default Accessories;
