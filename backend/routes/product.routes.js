import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { checkAuthAdmin } from "../middleware/auth.middleware.js";
import productImageUpload from "../middleware/productImageUpload.js";

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin
router.post("/", productImageUpload, createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
