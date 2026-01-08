import express from "express";
import ImageUpload from "../middleware/ImageUpload.js";
import { register, login, logOut } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", ImageUpload.single("image"), register);
router.post("/login", login);
router.post("/logout", logOut);

export default router;
