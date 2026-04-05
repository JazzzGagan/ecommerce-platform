import express from "express";
import {
  createCoupon,
  getCoupons,
  updateCoupon,
  validateCoupon,
} from "../controllers/coupon.controller.js";
import { checkAuth, checkAuthAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", checkAuthAdmin, getCoupons);
router.post("/", checkAuthAdmin, createCoupon);
router.patch("/:id", checkAuthAdmin, updateCoupon);
router.post("/validate", checkAuth, validateCoupon);

export default router;
