import { useState } from "react";
import React from "react";
import API from "../api/api";

const ProductList = ({ products = [], fetchProducts, onEdit }) => {
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      setLoadingDeleteId(id);
      await API.delete(`/products/${id}`);
      await fetchProducts();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setLoadingDeleteId(null);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-3">Product List</h3>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Price</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b hover:bg-gray-50">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.category?.name || "N/A"}</td>
              <td className="p-2">₹ {p.price}</td>
              <td className="p-2 text-center space-x-2">
                <button
                  onClick={() => onEdit(p)}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md text-white rounded hover:cursor-pointer hover:scale-105 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 shadow-sm hover:shadow-md text-white rounded hover:cursor-pointer hover:scale-105 transition duration-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
