import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  updateUserController,
  deleteUserController,
  signOutController,
  getUsersController,
  getUserController,
} from "./../controllers/userController.js";

//router
const router = express.Router();

//Cập nhật người dùng
router.put("/update/:userId", verifyToken, updateUserController);
//Xoá tài khoản
router.delete("/delete/:userId", verifyToken, deleteUserController);

//Đăng xuất
router.post("/signout", signOutController);
//Lấy danh sách tài khoản
router.get("/getusers", verifyToken, getUsersController);
//Lấy 1 người dùng
router.get("/:userId", getUserController);

export default router;
