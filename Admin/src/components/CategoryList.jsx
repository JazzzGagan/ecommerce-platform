import React from "react";
import API from "../api/api";

const CategoryList = ({ categories, fetchCategories }) => {

  const handleDelete = async (id) => {
    await API.delete(`/categories/${id}`);
    fetchCategories();
  };

  return (
    <div className="p-4 border rounded">
      <h3>Category List</h3>
      <ul>
        {categories.map(c => (
          <li key={c._id} className="flex justify-between border-b p-2">
            <span>{c.name} {c.parent && `(Parent: ${c.parent.name})`}</span>
            <button onClick={() => handleDelete(c._id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
