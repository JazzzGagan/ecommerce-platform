import React, { useState, useEffect } from "react";
import API from "../api/api";

const ProductForm = ({ fetchProducts }) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("description", description);

    // Append images
    images.forEach((image) => {
      formData.append("images", image);
    });

    await API.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setName("");
    setSlug("");
    setCategory("");
    setBrand("");
    setPrice("");
    setQuantity(0);
    setDescription("");
    setImages([]);
    setImagePreviews([]);
    fetchProducts();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-2xl p-8 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto mb-8 border border-gray-100"
    >
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
          Add Product
        </h3>
        <p className="text-gray-500 text-sm mt-2 font-regular">
          Create a new product for your store
        </p>
      </div>

      <div className="space-y-6">
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
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-regular placeholder-gray-400 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

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

        <div>
          <label className="block mb-2.5 text-sm font-semibold text-gray-800">
            Product Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-regular transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
          />

          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {images.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {images.length} image(s) selected
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 rounded-lg text-base transition-all duration-200 shadow-sm hover:shadow-md"
      >
        Add Product
      </button>
    </form>
  );
};

export default ProductForm;
