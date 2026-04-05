import { useEffect, useState } from "react";
import React from "react";
import API from "../api/api";

const ProductList = ({ products = [], fetchProducts, onEdit }) => {
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    fetchCategories();
  }, []);

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

  const buildCategoryHierarchy = (allCategories, prods) => {
    const categoryMap = {};
    const rootCategories = [];

    const sourceCategories =
      allCategories && allCategories.length > 0
        ? allCategories
        : prods.map((p) => p.category).filter(Boolean);

    sourceCategories.forEach((cat) => {
      const catId = typeof cat === "string" ? cat : cat._id;
      if (!catId || categoryMap[catId]) return;

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
    });

    prods.forEach((prod) => {
      const cat = prod.category;
      if (!cat) return;
      const catId = typeof cat === "string" ? cat : cat._id;
      if (!catId) return;

      if (!categoryMap[catId]) {
        categoryMap[catId] = {
          ...(typeof cat === "string" ? { _id: catId, name: "Unknown" } : cat),
          parentId: null,
          children: [],
          products: [],
        };
      }

      categoryMap[catId].products.push(prod);
    });

    Object.values(categoryMap).forEach((cat) => {
      if (cat.parentId && categoryMap[cat.parentId]) {
        categoryMap[cat.parentId].children.push(cat);
      } else if (!cat.parentId) {
        rootCategories.push(cat);
      }
    });

    const sortTree = (nodes) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      nodes.forEach((node) => sortTree(node.children));
    };

    sortTree(rootCategories);

    return rootCategories;
  };

  const categoryHierarchy = buildCategoryHierarchy(categories, products);

  const getLevelLabel = (level) => {
    if (level === 0) return "Parent";
    if (level === 1) return "Child";
    if (level === 2) return "Series";
    if (level === 3) return "Variant";
    return `Level ${level + 1}`;
  };

  const getRowClasses = (level) => {
    if (level === 0) {
      return "border-b bg-indigo-50/60 text-indigo-900";
    }
    if (level === 1) {
      return "border-b bg-slate-50 text-slate-800";
    }
    return "border-b bg-white text-slate-700";
  };

  const getBadgeClasses = (level) => {
    if (level === 0) return "bg-indigo-100 text-indigo-700";
    if (level === 1) return "bg-slate-200 text-slate-700";
    if (level === 2) return "bg-amber-100 text-amber-700";
    return "bg-emerald-100 text-emerald-700";
  };

  const renderCategoryRows = (category, level = 0) => {
    const rows = [];

    rows.push(
      <tr key={`cat-${category._id}`} className={getRowClasses(level)}>
        <td
          colSpan="4"
          className={`p-2 font-semibold text-sm ${
            level >= 2 ? "border-l-4 border-amber-200" : ""
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
      </tr>,
    );

    category.products.forEach((p) => {
      rows.push(
        <tr key={p._id} className="border-b hover:bg-slate-50 transition">
          <td className="p-2 text-slate-700 text-sm">{p.name}</td>
          <td className="p-2 text-slate-500 text-sm">{p.category?.name}</td>
          <td className="p-2 text-slate-700 text-sm font-medium text-right">
            ₹ {p.price}
          </td>
          <td className="p-2">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => onEdit(p)}
                className="min-w-[64px] px-2.5 py-1 text-xs bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md text-white rounded hover:cursor-pointer hover:scale-105 transition duration-200"
              >
                Edit
              </button>
              <button
                disabled={loadingDeleteId === p._id}
                onClick={() => handleDelete(p._id)}
                className="min-w-[64px] px-2.5 py-1 text-xs bg-red-600 hover:bg-red-700 shadow-sm hover:shadow-md text-white rounded disabled:opacity-50 hover:cursor-pointer hover:scale-105 transition duration-200"
              >
                {loadingDeleteId === p._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </td>
        </tr>,
      );
    });

    category.children.forEach((child) => {
      rows.push(...renderCategoryRows(child, level + 1));
    });

    return rows;
  };

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
            <th className="p-2 text-right">Price</th>
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
            categoryHierarchy.flatMap((root) => renderCategoryRows(root))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
