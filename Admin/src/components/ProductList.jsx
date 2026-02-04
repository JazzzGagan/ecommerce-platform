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

  const buildCategoryHierarchy = (prods) => {
    const categoryMap = {};
    const rootCategories = [];

    prods.forEach((prod) => {
      const cat = prod.category;
      if (!cat) return;

      const catId = cat._id;
      if (!categoryMap[catId]) {
        const parentId = cat.parent
          ? typeof cat.parent === "string"
            ? cat.parent
            : cat.parent._id || cat.parent
          : null;

        categoryMap[catId] = {
          ...cat,
          parentId,
          children: [],
          products: [],
        };
      }
      categoryMap[catId].products.push(prod);
    });

    // Organize categories into hierarchy
    Object.values(categoryMap).forEach((cat) => {
      if (cat.parentId && categoryMap[cat.parentId]) {
        categoryMap[cat.parentId].children.push(cat);
      } else if (!cat.parentId) {
        rootCategories.push(cat);
      }
    });

    rootCategories.sort((a, b) => a.name.localeCompare(b.name));
    rootCategories.forEach((root) =>
      root.children.sort((a, b) => a.name.localeCompare(b.name)),
    );

    return rootCategories;
  };

  const categoryHierarchy = buildCategoryHierarchy(products);

  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="text-lg font-semibold mb-3 text-slate-900">
        Product List
      </h3>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-700">
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Price</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categoryHierarchy.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center text-slate-500">
                No products found
              </td>
            </tr>
          ) : (
            categoryHierarchy.flatMap((parent) => [
              // Parent category header
              ...(parent.products.length > 0 || parent.children.length > 0
                ? [
                    <tr
                      key={`parent-${parent._id}`}
                      className="border-b bg-indigo-50/60"
                    >
                      <td
                        colSpan="4"
                        className="p-2 font-semibold text-indigo-900"
                      >
                        {parent.name}
                        <span className="ml-2 text-xs font-semibold text-indigo-600">
                          Parent
                        </span>
                      </td>
                    </tr>,
                  ]
                : []),
              // Sub-parent categories with their products
              ...parent.children.flatMap((subparent) => [
                <tr
                  key={`subparent-${subparent._id}`}
                  className="border-b bg-slate-50"
                >
                  <td colSpan="4" className="p-2 font-semibold text-slate-800">
                    {subparent.name}
                    <span className="ml-2 text-xs font-semibold text-slate-600">
                      SubParent
                    </span>
                  </td>
                </tr>,
                ...subparent.products.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="p-2 text-slate-700">{p.name}</td>
                    <td className="p-2 text-slate-600">{p.category?.name}</td>
                    <td className="p-2 text-slate-700 font-medium">
                      ₹ {p.price}
                    </td>
                    <td className="p-2 text-center space-x-2">
                      <button
                        onClick={() => onEdit(p)}
                        className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md text-white rounded hover:cursor-pointer hover:scale-105 transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        disabled={loadingDeleteId === p._id}
                        onClick={() => handleDelete(p._id)}
                        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 shadow-sm hover:shadow-md text-white rounded disabled:opacity-50 hover:cursor-pointer hover:scale-105 transition duration-200"
                      >
                        {loadingDeleteId === p._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                )),
              ]),
              // Products directly under parent (no subparent)
              ...parent.products.map((p) => (
                <tr
                  key={p._id}
                  className="border-b hover:bg-slate-50 transition"
                >
                  <td className="p-2 text-slate-700">{p.name}</td>
                  <td className="p-2 text-slate-600">{p.category?.name}</td>
                  <td className="p-2 text-slate-700 font-medium">
                    ₹ {p.price}
                  </td>
                  <td className="p-2 text-center space-x-2">
                    <button
                      onClick={() => onEdit(p)}
                      className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md text-white rounded hover:cursor-pointer hover:scale-105 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      disabled={loadingDeleteId === p._id}
                      onClick={() => handleDelete(p._id)}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 shadow-sm hover:shadow-md text-white rounded disabled:opacity-50 hover:cursor-pointer hover:scale-105 transition duration-200"
                    >
                      {loadingDeleteId === p._id ? "Deleting..." : "Delete"}
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

export default ProductList;
