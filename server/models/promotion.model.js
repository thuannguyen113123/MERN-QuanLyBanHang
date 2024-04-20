import mongoose from "mongoose";

const PromotionSchema = new mongoose.Schema(
  {
    codePromotion: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    quantityPromotion: {
      type: Number,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Promotion", PromotionSchema);
