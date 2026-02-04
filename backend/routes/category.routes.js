import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { checkAuthAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin (Protected)
router.post("/", checkAuthAdmin, createCategory);
// Public
router.get("/", getCategories);
// Admin (Protected)
router.patch("/:id", checkAuthAdmin, updateCategory);
router.delete("/:id", checkAuthAdmin, deleteCategory);

export default router;
