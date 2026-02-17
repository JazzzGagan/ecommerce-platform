import React, { useState, useEffect, useRef } from "react";
import API from "../api/api";

const ProductForm = ({ fetchProducts, editingProduct, setEditingProduct }) => {
  const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [hierarchicalCategories, setHierarchicalCategories] = useState([]);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    API.get("/categories").then((res) => {
      setCategories(res.data);
      // Build hierarchical structure
      const organized = organizeCategories(res.data);
      console.log("Organized categories:", organized);
      setHierarchicalCategories(organized);
    });
  }, []);

  // Organize categories into multi-level parent-child structure
  const organizeCategories = (cats) => {
    if (!cats || cats.length === 0) return [];

    const categoryMap = {};

    // Create a map of all categories with their full data
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

    // Organize parent-child relationships
    const rootCategories = [];
    Object.values(categoryMap).forEach((cat) => {
      if (cat.parentId && categoryMap[cat.parentId]) {
        // This is a child category
        categoryMap[cat.parentId].children.push(cat);
      } else if (!cat.parentId) {
        // This is a root/parent category
        rootCategories.push(cat);
      }
    });

    return rootCategories.sort((a, b) => a.name.localeCompare(b.name));
  };

  // Recursively render category options with proper indentation
  const renderCategoryOptions = (categories, level = 0) => {
    return categories
      .map((cat) => [
        <option
          key={cat._id}
          value={cat._id}
          disabled={cat.children && cat.children.length > 0}
        >
          {"\u00A0".repeat(level * 3)}
          {level > 0 ? "└─ " : ""}
          {cat.name}
          {cat.children && cat.children.length > 0 ? " (Parent)" : ""}
        </option>,
        ...(cat.children && cat.children.length > 0
          ? renderCategoryOptions(cat.children, level + 1)
          : []),
      ])
      .flat();
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setCategory("");
    setBrand("");
    setPrice("");
    setQuantity(0);
    setDescription("");
    setImages([]);
    setImagePreviews([]);
    setExistingImages([]);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Load editing product data
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setSlug(editingProduct.slug);
      setCategory(editingProduct.category?._id || "");
      setBrand(editingProduct.brand || "");
      setPrice(editingProduct.price);
      setQuantity(editingProduct.quantity);
      setDescription(editingProduct.description || "");
      setExistingImages(editingProduct.images || []);

      setImages([]);
      setImagePreviews([]);
    } else {
      resetForm();
    }
  }, [editingProduct]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  // Handle new image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Remove new image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("=== FRONTEND SUBMIT ===");
      console.log("Images array length:", images.length);
      console.log("Images:", images);

      // Convert images to base64 strings for Cloudinary
      const imagePromises = images.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(imagePromises);
      console.log("Base64 images count:", base64Images.length);
      console.log(
        "First image preview (first 100 chars):",
        base64Images[0]?.substring(0, 100),
      );

      const productData = {
        name,
        slug,
        category,
        brand,
        price,
        quantity,
        description,
        images: base64Images, // Send base64 encoded images
        existingImages, // Keep existing image URLs
      };

      console.log("Sending product data with", base64Images.length, "images");

      if (editingProduct) {
        await API.patch(`/products/${editingProduct._id}`, productData);
        setEditingProduct(null);
      } else {
        await API.post("/products", productData);
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-2xl p-8 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto mb-8 border border-gray-100"
    >
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h3>
        <p className="text-gray-500 text-sm mt-2 font-regular">
          Create a new product for your store
        </p>
      </div>

      <div className="space-y-6">
        {/* Product Name & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2.5 text-sm font-semibold text-gray-800">
              Product Name
            </label>
            <input
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-regular placeholder-gray-400 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block mb-2.5 text-sm font-semibold text-gray-800">
              Slug
            </label>
            <input
              type="text"
              placeholder="product-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-regular placeholder-gray-400 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2.5 text-sm font-semibold text-gray-800">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-regular transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="">Select Category</option>
              {renderCategoryOptions(hierarchicalCategories)}
            </select>
          </div>
          <div>
            <label className="block mb-2.5 text-sm font-semibold text-gray-800">
              Brand
            </label>
            <input
              type="text"
              placeholder="Brand name"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-regular placeholder-gray-400 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Price & Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2.5 text-sm font-semibold text-gray-800">
              Price
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-regular placeholder-gray-400 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block mb-2.5 text-sm font-semibold text-gray-800">
              Quantity
            </label>
            <input
              type="number"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-regular placeholder-gray-400 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2.5 text-sm font-semibold text-gray-800">
            Description
          </label>
          <textarea
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-regular placeholder-gray-400 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          ></textarea>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-2.5 text-sm font-semibold text-gray-800">
            Product Images
            <span className="text-gray-500 font-normal text-xs ml-2">
              (Hold Ctrl/Cmd to select multiple)
            </span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Existing Image Previews with remove */}
        {existingImages.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {existingImages.map((imgUrl, idx) => (
              <div key={`existing-${idx}`} className="relative">
                <img
                  src={imgUrl}
                  alt={`Existing Preview ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(idx)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New Image Previews with remove */}
        {imagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {imagePreviews.map((img, idx) => (
              <div key={`new-${idx}`} className="relative">
                <img
                  src={img}
                  alt={`New Preview ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg text-base transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{editingProduct ? "Updating..." : "Adding..."}</span>
          </>
        ) : (
          <span>{editingProduct ? "Update Product" : "Add Product"}</span>
        )}
      </button>
    </form>
  );
};

export default ProductForm;
