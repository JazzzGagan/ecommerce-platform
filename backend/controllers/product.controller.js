import Product from "../models/product.model.js";

// Create product
export const createProduct = async (req, res) => {
  try {
    const { name, slug, category, price, brand, description, quantity } =
      req.body;

    if (!name || !slug || !category || price === undefined) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Extract image paths from uploaded files
    const images = req.files ? req.files.map((file) => file.path) : [];

    // Check if slug already exists
    const existing = await Product.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: "Slug already exists" });
    }

    // Create product with images included
    const productData = {
      name,
      slug,
      category,
      price,
      brand,
      description,
      quantity,
      images,
    };

    const product = await Product.create(productData);

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product disabled", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
