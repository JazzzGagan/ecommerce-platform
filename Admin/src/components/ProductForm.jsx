import React, { useState, useEffect } from "react";
import API from "../api/api";

const ProductForm = ({ fetchProducts, editingProduct, setEditingProduct }) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);

  const [images, setImages] = useState([]); 
  const [imagePreviews, setImagePreviews] = useState([]); 

  const [existingImages, setExistingImages] = useState([]); 

  // Fetch categories on mount
  useEffect(() => {
    API.get("/categories").then((res) => setCategories(res.data));
  }, []);

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
  };

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

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("category", category);
      formData.append("brand", brand);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("description", description);

      images.forEach((img) => {
        formData.append("images", img);
      });

      existingImages.forEach((imgUrl) => {
        formData.append("existingImages", imgUrl);
      });

      if (editingProduct) {
       
        //console.log("Edit API called for product ID:", editingProduct._id);

        await API.patch(`/products/${editingProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setEditingProduct(null);
      } else {
        console.log("Create API called for new product");

        await API.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit product. Please try again.");
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
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
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
          </label>
          <input
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
        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 rounded-lg text-base transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {editingProduct ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;
