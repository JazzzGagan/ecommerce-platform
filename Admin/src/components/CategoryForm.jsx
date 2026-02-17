import React, { useState, useEffect } from "react";
import API from "../api/api";

const CategoryForm = ({
  fetchCategories,
  editingCategory,
  setEditingCategory,
}) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parent, setParent] = useState("");
  const [categories, setCategories] = useState([]);
  const [hierarchicalCategories, setHierarchicalCategories] = useState([]);

  // Load categories to select parent
  useEffect(() => {
    API.get("/categories").then((res) => {
      setCategories(res.data);
      setHierarchicalCategories(organizeCategories(res.data));
    });
  }, []);

  const organizeCategories = (cats) => {
    if (!cats || cats.length === 0) return [];

    const categoryMap = {};

    cats.forEach((cat) => {
      categoryMap[cat._id] = {
        ...cat,
        children: [],
        parentId: cat.parent
          ? typeof cat.parent === "string"
            ? cat.parent
            : cat.parent._id || cat.parent
          : null,
      };
    });

    const rootCategories = [];
    Object.values(categoryMap).forEach((cat) => {
      if (cat.parentId && categoryMap[cat.parentId]) {
        categoryMap[cat.parentId].children.push(cat);
      } else if (!cat.parentId) {
        rootCategories.push(cat);
      }
    });

    rootCategories.forEach((root) =>
      root.children.sort((a, b) => a.name.localeCompare(b.name)),
    );

    return rootCategories.sort((a, b) => a.name.localeCompare(b.name));
  };

  const renderCategoryOptions = (categories, level = 0) =>
    categories
      .map((cat) => {
        if (cat._id === excludedId) return [];

        return [
          <option key={cat._id} value={cat._id}>
            {"\u00A0".repeat(level * 3)}
            {level > 0 ? "└─ " : ""}
            {cat.name}
          </option>,
          ...(cat.children && cat.children.length > 0
            ? renderCategoryOptions(cat.children, level + 1)
            : []),
        ];
      })
      .flat();

  // Load data when editingCategory changes
  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || "");
      setSlug(editingCategory.slug || "");
      setParent(editingCategory.parent?._id || "");
    } else {
      resetForm();
    }
  }, [editingCategory]);

  const resetForm = () => {
    setName("");
    setSlug("");
    setParent("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name,
        slug,
        parent: parent || null,
      };

      if (editingCategory) {
        await API.patch(`/categories/${editingCategory._id}`, payload);
        setEditingCategory(null);
      } else {
        await API.post("/categories", payload);
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      console.error("Failed to submit category:", error);
      alert("Failed to submit category. Please try again.");
    }
  };

  const excludedId = editingCategory?._id;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-2xl p-8 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto mb-8 border border-gray-100"
    >
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
          {editingCategory ? "Edit Category" : "Add Category"}
        </h3>
        <p className="text-gray-500 text-sm mt-2 font-regular">
          {editingCategory
            ? "Update product category details"
            : "Create a new product category for your store"}
        </p>
      </div>

      <div className="space-y-6">
        {/* Name & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2.5 text-sm font-semibold text-gray-800">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block mb-2.5 text-sm font-semibold text-gray-800">
              Slug
            </label>
            <input
              type="text"
              placeholder="category-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Parent Category */}
        <div>
          <label className="block mb-2.5 text-sm font-semibold text-gray-800">
            Parent Category
          </label>
          <select
            value={parent}
            onChange={(e) => setParent(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
          >
            <option value="">No Parent (Main Category)</option>
            {renderCategoryOptions(hierarchicalCategories)}
          </select>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 rounded-lg text-base transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {editingCategory ? "Update Category" : "Add Category"}
        </button>

        {editingCategory && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setEditingCategory(null);
            }}
            className="flex-1 bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-700 font-semibold py-3.5 rounded-lg text-base transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;
