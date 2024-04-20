import express from "express";
import {
  registerController,
  loginController,
  loginWithGoogleController,
  getAllOrdersController,
  getOrdersController,
  orderStatusController,
} from "../controllers/authController.js";
import { verifyToken } from "../utils/verifyUser.js";

//router
const router = express.Router();

//Đăng ký
router.post("/register", registerController);

//Đăng nhập
router.post("/login", loginController);
//Đăng nhập bằng gg
router.post("/google", loginWithGoogleController);

//Đặt hàng
router.get("/orders", verifyToken, getOrdersController);
//Tất cả đơn đặt hàng
router.get("/all-orders", verifyToken, getAllOrdersController);
//Cập nhật trang thái đơn hàng
router.put("/order-status/:orderId", verifyToken, orderStatusController);

export default router;
