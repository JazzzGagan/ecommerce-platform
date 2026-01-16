import React, { useEffect, useState } from "react";
import CategoryForm from "../components/CategoryForm.jsx";
import CategoryList from "../components/CategoryList.jsx";
import API from "../api/api";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const res = await API.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Category Management
          </h1>
          <p className="mt-2 text-gray-600 text-base">
            Add and manage your product categories
          </p>
        </div>

        {/* Category Form Section */}
        <div className="mb-12">
          <CategoryForm fetchCategories={fetchCategories} />
        </div>

        {/* Divider */}
        <div className="relative mb-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Category List
            </span>
          </div>
        </div>

        {/* Category List Section */}
        <div>
          <CategoryList
            categories={categories}
            fetchCategories={fetchCategories}
          />
        </div>
      </div>
    </div>
  );
};

export default Categories;
