import React from "react";
import API from "../api/api";

const ProductList = ({ products, fetchProducts }) => {
  const handleDelete = async (id) => {
    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="p-4 border rounded">
      <h3>Product List</h3>
      <ul>
        {products.map((p) => (
          <li key={p._id} className="flex justify-between border-b p-2">
            <span>
              {p.name} (Category: {p.category.name})
            </span>
            <button
              onClick={() => handleDelete(p._id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
