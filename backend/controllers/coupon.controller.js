import Coupon from "../models/coupon.model.js";

const normalizeCouponCode = (value) =>
  String(value || "")
    .trim()
    .toUpperCase();

const computeDiscountAmount = ({ discountType, discountValue, subtotal }) => {
  const safeSubtotal = Number(subtotal || 0);
  const safeDiscountValue = Number(discountValue || 0);

  if (safeSubtotal <= 0 || safeDiscountValue <= 0) {
    return 0;
  }

  if (discountType === "percentage") {
    return Math.min((safeSubtotal * safeDiscountValue) / 100, safeSubtotal);
  }

  return Math.min(safeDiscountValue, safeSubtotal);
};

const isExpired = (dateValue) => new Date(dateValue).getTime() < Date.now();

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      expiresAt,
      isActive = true,
    } = req.body;

    const normalizedCode = normalizeCouponCode(code);

    if (!normalizedCode) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    if (!["percentage", "fixed"].includes(discountType)) {
      return res.status(400).json({
        message: "discountType must be either 'percentage' or 'fixed'",
      });
    }

    if (!discountValue || Number(discountValue) <= 0) {
      return res
        .status(400)
        .json({ message: "discountValue must be greater than 0" });
    }

    if (!expiresAt || Number.isNaN(new Date(expiresAt).getTime())) {
      return res.status(400).json({ message: "A valid expiresAt is required" });
    }

    const coupon = await Coupon.create({
      code: normalizedCode,
      discountType,
      discountValue: Number(discountValue),
      expiresAt,
      isActive: Boolean(isActive),
    });

    return res.status(201).json(coupon);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Coupon code already exists" });
    }

    return res.status(500).json({ message: "Failed to create coupon" });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json(coupons);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch coupons" });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.code !== undefined) {
      updates.code = normalizeCouponCode(updates.code);
      if (!updates.code) {
        return res.status(400).json({ message: "Coupon code cannot be empty" });
      }
    }

    if (
      updates.discountType !== undefined &&
      !["percentage", "fixed"].includes(updates.discountType)
    ) {
      return res.status(400).json({
        message: "discountType must be either 'percentage' or 'fixed'",
      });
    }

    if (
      updates.discountValue !== undefined &&
      Number(updates.discountValue) <= 0
    ) {
      return res
        .status(400)
        .json({ message: "discountValue must be greater than 0" });
    }

    if (
      updates.expiresAt !== undefined &&
      Number.isNaN(new Date(updates.expiresAt).getTime())
    ) {
      return res.status(400).json({ message: "A valid expiresAt is required" });
    }

    const coupon = await Coupon.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    return res.status(200).json(coupon);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Coupon code already exists" });
    }

    return res.status(500).json({ message: "Failed to update coupon" });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;
    const normalizedCode = normalizeCouponCode(code);
    const subtotal = Number(amount || 0);

    if (!normalizedCode) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    if (!subtotal || subtotal <= 0) {
      return res.status(400).json({ message: "A valid amount is required" });
    }

    const coupon = await Coupon.findOne({ code: normalizedCode });

    if (!coupon || !coupon.isActive) {
      return res.status(400).json({ message: "Invalid coupon code" });
    }

    if (isExpired(coupon.expiresAt)) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    const discountAmount = Number(
      computeDiscountAmount({
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        subtotal,
      }).toFixed(2),
    );

    return res.status(200).json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      subtotal: Number(subtotal.toFixed(2)),
      finalAmount: Number((subtotal - discountAmount).toFixed(2)),
      expiresAt: coupon.expiresAt,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to validate coupon" });
  }
};
