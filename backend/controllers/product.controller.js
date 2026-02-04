import Product from "../models/product.model.js";
import fs from "fs";
import path from "path";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create product
export const createProduct = async (req, res) => {
  try {
    console.log("=== CREATE PRODUCT REQUEST ===");
    console.log("Request body keys:", Object.keys(req.body));

    const { images, existingImages, ...productData } = req.body;
    console.log("Product data:", productData);
    console.log("Images field type:", typeof images);
    console.log("Images field value:", images);
    console.log("Number of images received:", images?.length || 0);

    const imageUrls = [];
    if (images && images.length > 0) {
      console.log("Starting Cloudinary upload...");
      for (let i = 0; i < images.length; i++) {
        console.log(`Uploading image ${i + 1}/${images.length}...`);
        try {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "ecommerce/products",
          });
          console.log(`✓ Image ${i + 1} uploaded successfully`);
          console.log(`  - URL: ${result.secure_url}`);
          console.log(`  - Public ID: ${result.public_id}`);
          console.log(`  - Format: ${result.format}`);
          imageUrls.push(result.secure_url);
        } catch (uploadError) {
          console.error(
            `✗ Failed to upload image ${i + 1}:`,
            uploadError.message,
          );
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
      }
    }

    const allImages = [...(existingImages || []), ...imageUrls];
    console.log("All image URLs:", allImages);

    const product = await Product.create({
      ...productData,
      images: allImages,
    });

    console.log("✓ Product created successfully with ID:", product._id);
    console.log("=================================");
    res.status(201).json(product);
  } catch (error) {
    console.error("✗ Error creating product:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: error.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const { search, isActive } = req.query;

    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const products = await Product.find(filter)
      .populate("category")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Get single products
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      category,
      price,
      brand,
      description,
      quantity,
      existingImages,
      images,
    } = req.body;

    console.log("=== UPDATE PRODUCT REQUEST ===");
    console.log("Existing images:", existingImages);
    console.log("New images count:", images?.length || 0);

    let existingImgs = [];
    if (existingImages) {
      if (typeof existingImages === "string") {
        existingImgs = JSON.parse(existingImages);
      } else {
        existingImgs = existingImages;
      }
    }

    const imageUrls = [];

    // Upload new base64 images to Cloudinary
    if (images && images.length > 0) {
      console.log("Starting Cloudinary upload for new images...");
      for (let i = 0; i < images.length; i++) {
        console.log(`Uploading image ${i + 1}/${images.length}...`);
        try {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "ecommerce/products",
          });
          console.log(`✓ Image ${i + 1} uploaded successfully`);
          console.log(`  - URL: ${result.secure_url}`);
          console.log(`  - Public ID: ${result.public_id}`);
          imageUrls.push(result.secure_url);
        } catch (uploadError) {
          console.error(
            `✗ Failed to upload image ${i + 1}:`,
            uploadError.message,
          );
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
      }
    }

    const allImages = [...existingImgs, ...imageUrls];
    console.log("All images to save:", allImages);

    const productData = {
      name,
      slug,
      category,
      price,
      brand,
      description,
      quantity,
      images: allImages,
    };

    // Update product
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true },
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("✓ Product updated successfully");
    console.log("=================================");
    res.json(product);
  } catch (err) {
    console.error("✗ Error updating product:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.images && product.images.length > 0) {
      product.images.forEach((imgPath) => {
        const fullPath = path.resolve(imgPath);

        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product and images deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
