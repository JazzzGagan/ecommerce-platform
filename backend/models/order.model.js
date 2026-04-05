import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: "" },
  },
  { _id: false },
);

const addressSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
    building: { type: String, default: "" },
    city: { type: String, required: true },
    zone: { type: String, default: "" },
    zip: { type: String, default: "" },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      default: [],
    },
    shippingAddress: {
      type: addressSchema,
      required: true,
    },
    billingAddress: {
      type: addressSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["esewa", "khalti", "fonepay", "cod"],
      default: "esewa",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    subtotal: { type: Number, required: true },
    couponCode: { type: String, default: "" },
    discountType: {
      type: String,
      enum: ["", "percentage", "fixed"],
      default: "",
    },
    discountValue: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    transactionUuid: { type: String, index: true, unique: true, sparse: true },
    esewaTransactionUuid: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
      default: null,
    },
    esewaRefId: {
      type: String,
      default: null,
    },
    khaltiPidx: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
      default: null,
    },
    paymentReference: { type: String, default: "" },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
