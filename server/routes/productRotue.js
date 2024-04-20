import express from "express";
import {
  brainTreePaymentController,
  braintreeTokenController,
  createProductController,
  createSizeProductController,
  deleteProductController,
  deleteSizeProductController,
  getProductController,
  getSizeProductController,
  updateProductController,
  updateSizeProductController,
} from "../controllers/productController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

//tạo sản phẩm
router.post("/create-product", verifyToken, createProductController);
//Lấy tất cả sản phẩm
router.get("/get-product", getProductController);

//Xóa sản phẩm
router.delete("/delete-product/:pId", verifyToken, deleteProductController);

//Cập nhật sản phẩm
router.put("/update-product/:pId", verifyToken, updateProductController);
// Lấy size theo sản phẩm
router.get("/size-product/:pId", getSizeProductController);
//Xóa size sản phẩm
router.delete(
  "/delete-sizeProduct/:pId",
  verifyToken,
  deleteSizeProductController
);
//tạo size sản phẩm
router.post("/create-sizeProduct", verifyToken, createSizeProductController);
//Cập nhật size sản phẩm
router.put(
  "/update-sizeProduct/:sizeId",
  verifyToken,
  updateSizeProductController
);
//Thanh toán (Token) routes
router.get("/braintree/token", braintreeTokenController);
//Thanh toán
router.post("/braintree/payment", verifyToken, brainTreePaymentController);

export default router;
