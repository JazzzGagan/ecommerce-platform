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
    <div className="flex flex-col items-center p-8 space-y-6">
      <h1 className="text-2xl font-bold">Category Management</h1>

      <CategoryForm fetchCategories={fetchCategories} />
      <CategoryList categories={categories} fetchCategories={fetchCategories} />
    </div>
  );
};

export default Categories;
