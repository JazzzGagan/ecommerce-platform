import express from "express";
import upload from "../middleware/upload.js";
import {
  register,
  login,
  logOut,
} from "../controllers/auth/authControllers.js";

const router = express.Router();

router.post("/register", upload.single("image"), register);
router.post("/login", login);
router.post("/logout", logOut);

export default router;
