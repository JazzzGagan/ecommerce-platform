import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/user.controller.js";
import { checkAuthAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", checkAuthAdmin, getAllUsers);
router.get("/:id", checkAuthAdmin, getUserById);
router.post("/", checkAuthAdmin, createUser);
router.put("/:id", checkAuthAdmin, updateUser);
router.delete("/:id", checkAuthAdmin, deleteUser);

export default router;
