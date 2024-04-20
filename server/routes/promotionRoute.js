import express from "express";
import {
  createPromotionController,
  deletePromotionController,
  getAllPromotion,
} from "../controllers/promotionController.js";

import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

//Tạo khuyến mãi
router.post("/create-promotion", verifyToken, createPromotionController);

router.get("/get-promotions", getAllPromotion);
//Xóa mã khuyến mãi
router.delete("/delete-promotion/:pId", verifyToken, deletePromotionController);

export default router;
