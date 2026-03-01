import express from "express";
import {
  handleEsewaFailure,
  handleEsewaSuccess,
  initiateEsewaPayment,
  initiateKhaltiPayment,
  verifyKhaltiPayment,
} from "../controllers/order.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    router: "orders",
    endpoints: [
      "POST /esewa/initiate",
      "POST /khalti/initiate",
      "POST /khalti/verify",
      "GET /esewa/success",
      "GET /esewa/failure",
    ],
  });
});

router.post("/esewa/initiate", checkAuth, initiateEsewaPayment);
router.post("/khalti/initiate", checkAuth, initiateKhaltiPayment);
router.get("/esewa/success", handleEsewaSuccess);
router.get("/esewa/failure", handleEsewaFailure);
router.post("/khalti/verify", checkAuth, verifyKhaltiPayment);

export default router;
