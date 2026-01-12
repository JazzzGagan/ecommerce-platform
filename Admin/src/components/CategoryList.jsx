import React, { useState } from "react";
import API from "../api/api";

const CategoryList = ({ categories, fetchCategories, onEdit }) => {
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      setLoadingDeleteId(id);
      await API.delete(`/categories/${id}`);
      await fetchCategories();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setLoadingDeleteId(null);
    }
  };

  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="text-lg font-semibold mb-3">Product Type List</h3>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-100 text-left">
            <th className="p-2">Category Name</th>
            <th className="p-2">Slug</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                No categories found
              </td>
            </tr>
          ) : (
            categories.map((c) => (
              <tr key={c._id} className="border-b hover:bg-gray-50">
                <td className="p-2 font-medium">{c.name}</td>
                <td className="p-2 text-gray-600">{c.slug}</td>
                <td className="p-2 text-center space-x-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(c)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:cursor-pointer hover:scale-105 transition duration-200"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    disabled={loadingDeleteId === c._id}
                    onClick={() => handleDelete(c._id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded disabled:opacity-50 hover:cursor-pointer hover:scale-105 transition duration-200"
                  >
                    {loadingDeleteId === c._id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
