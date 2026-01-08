import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },

  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
