import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    product: { type: mongoose.ObjectId, ref: "Products", required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Size", sizeSchema);
