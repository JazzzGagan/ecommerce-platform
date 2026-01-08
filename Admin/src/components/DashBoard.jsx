import React, { useState, useEffect } from "react";
import CategoryForm from "../components/CategoryForm";
import CategoryList from "../components/CategoryList";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import API from "../api/api";

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchCategories = async () => {
    const res = await API.get("/categories");
    setCategories(res.data);
  };

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <CategoryForm fetchCategories={fetchCategories} />
          <CategoryList
            categories={categories}
            fetchCategories={fetchCategories}
          />
        </div>
        <div>
          <ProductForm fetchProducts={fetchProducts} />
          <ProductList products={products} fetchProducts={fetchProducts} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
