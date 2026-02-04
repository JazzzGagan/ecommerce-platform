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

    roots.sort((a, b) => a.name.localeCompare(b.name));
    roots.forEach((root) =>
      root.children.sort((a, b) => a.name.localeCompare(b.name)),
    );

    return roots;
  };

  const hierarchicalCategories = buildHierarchy(categories);

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
            hierarchicalCategories.flatMap((parent) => [
              <tr key={parent._id} className="border-b bg-indigo-50/60">
                <td className="p-2 font-semibold text-indigo-900">
                  {parent.name}
                  {/* <span className="ml-2 text-xs font-semibold text-indigo-600">
                    Parent
                  </span> */}
                </td>
                <td className="p-2 text-indigo-700/80">{parent.slug}</td>
                <td className="p-2 text-center space-x-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(parent)}
                      className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md text-white rounded hover:cursor-pointer hover:scale-105 transition duration-200"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    disabled={loadingDeleteId === parent._id}
                    onClick={() => handleDelete(parent._id)}
                    className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 shadow-sm hover:shadow-md text-white rounded disabled:opacity-50 hover:cursor-pointer hover:scale-105 transition duration-200"
                  >
                    {loadingDeleteId === parent._id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>,
              ...parent.children.map((child) => (
                <tr key={child._id} className="border-b hover:bg-slate-50">
                  <td className="p-2 text-slate-700">{child.name}</td>
                  <td className="p-2 text-slate-500">{child.slug}</td>
                  <td className="p-2 text-center space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(child)}
                        className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md text-white rounded hover:cursor-pointer hover:scale-105 transition duration-200"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      disabled={loadingDeleteId === child._id}
                      onClick={() => handleDelete(child._id)}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 shadow-sm hover:shadow-md text-white rounded disabled:opacity-50 hover:cursor-pointer hover:scale-105 transition duration-200"
                    >
                      {loadingDeleteId === child._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              )),
            ])
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
