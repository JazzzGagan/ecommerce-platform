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
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/products", {
      name,
      slug,
      category,
      brand,
      price,
      quantity,
      description,
    });
    setName("");
    setSlug("");
    setCategory("");
    setBrand("");
    setPrice("");
    setQuantity(0);
    setDescription("");
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
