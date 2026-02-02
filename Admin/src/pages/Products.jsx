import React, { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import API from "../api/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Product Management
          </h1>
          <p className="mt-2 text-gray-600 text-base">
            Add and manage your product inventory
          </p>
        </div>

        {/* Product Form */}
        <div className="mb-12">
          <ProductForm
            fetchProducts={fetchProducts}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
          />
        </div>

        {/* Divider */}
        <div className="relative mb-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Product List
            </span>
          </div>
        </div>

        {/* Product List */}
        <ProductList
          products={products}
          fetchProducts={fetchProducts}
          onEdit={setEditingProduct}
        />
      </div>
    </div>
  );
};

export default Products;

