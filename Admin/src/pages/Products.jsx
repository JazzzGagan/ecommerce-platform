import React, { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import API from "../api/api";

const Products = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col items-center p-8 space-y-6">
      <h1 className="text-2xl font-bold">Product Management</h1>

      <ProductForm fetchProducts={fetchProducts} />
      <ProductList products={products} fetchProducts={fetchProducts} />
    </div>
  );
};

export default Products;
