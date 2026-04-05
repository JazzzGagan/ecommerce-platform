import React, { useState } from "react";
import API from "../api/api";

const CategoryList = ({ categories, fetchCategories, onEdit }) => {
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      setLoadingDeleteId(id);
      await API.delete(`/categories/${id}`);
      await fetchCategories();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete category. Please try again.");
    } finally {
      setLoadingDeleteId(null);
    }
  };

  const buildHierarchy = (cats) => {
    if (!cats || cats.length === 0) return [];

    const categoryMap = {};
    cats.forEach((cat) => {
      const parentId = cat.parent
        ? typeof cat.parent === "string"
          ? cat.parent
          : cat.parent._id || cat.parent
        : null;

      categoryMap[cat._id] = {
        ...cat,
        parentId,
        children: [],
      };
    });

    const roots = [];
    Object.values(categoryMap).forEach((cat) => {
      if (cat.parentId && categoryMap[cat.parentId]) {
        categoryMap[cat.parentId].children.push(cat);
      } else if (!cat.parentId) {
        roots.push(cat);
      }
    });

    const sortTree = (nodes) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      nodes.forEach((node) => sortTree(node.children));
    };

    sortTree(roots);

    return roots;
  };

  const hierarchicalCategories = buildHierarchy(categories);

  const getLevelLabel = (level) => {
    if (level === 0) return "Parent";
    if (level === 1) return "Child";
    if (level === 2) return "Grandchild";
    return `Level ${level + 1}`;
  };

  const getRowClasses = (level) => {
    if (level === 0) return "border-b bg-slate-50 text-slate-900";
    if (level === 1) return "border-b bg-slate-100 text-slate-800";
    if (level === 2) return "border-b bg-slate-50 text-slate-700";
    return "border-b bg-white text-slate-700";
  };

  const getBadgeClasses = (level) => {
    if (level === 0) return "bg-slate-200 text-slate-700";
    if (level === 1) return "bg-slate-100 text-slate-600";
    if (level === 2) return "bg-slate-100 text-slate-500";
    return "bg-slate-50 text-slate-500";
  };

  const renderCategoryRows = (category, level = 0) => {
    const rows = [];

    rows.push(
      <tr key={`cat-${category._id}`} className={getRowClasses(level)}>
        <td
          className={`p-2 font-semibold ${
            level === 0 ? "text-base" : level === 1 ? "text-sm" : "text-xs"
          }`}
          style={{ paddingLeft: `${12 + level * 18}px` }}
        >
          {category.name}
          <span
            className={`ml-2 text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${getBadgeClasses(
              level,
            )}`}
          >
            {getLevelLabel(level)}
          </span>
        </td>
        <td className="p-2 text-xs text-slate-600">{category.slug}</td>
        <td className="p-2">
          <div className="flex items-center justify-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(category)}
                className="min-w-[64px] px-2.5 py-1 text-xs bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md text-white rounded hover:cursor-pointer hover:scale-105 transition duration-200"
              >
                Edit
              </button>
            )}
            <button
              disabled={loadingDeleteId === category._id}
              onClick={() => handleDelete(category._id)}
              className="min-w-[64px] px-2.5 py-1 text-xs bg-red-600 hover:bg-red-700 shadow-sm hover:shadow-md text-white rounded disabled:opacity-50 hover:cursor-pointer hover:scale-105 transition duration-200"
            >
              {loadingDeleteId === category._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </td>
      </tr>,
    );

    category.children.forEach((child) => {
      rows.push(...renderCategoryRows(child, level + 1));
    });

    return rows;
  };

  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="text-lg font-semibold mb-3 text-slate-900">
        Category List
      </h3>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-700">
            <th className="p-2">Category Name</th>
            <th className="p-2">Slug</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {hierarchicalCategories.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-4 text-center text-slate-500">
                No categories found
              </td>
            </tr>
          ) : (
            hierarchicalCategories.flatMap((root) => renderCategoryRows(root))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
