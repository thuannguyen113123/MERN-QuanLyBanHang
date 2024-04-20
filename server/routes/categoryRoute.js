import express from "express";
import {
  categoryController,
  createCategoryController,
  deleteCategoryController,
  singleCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

//Tạo danh mục
router.post("/create-category", verifyToken, createCategoryController);
//Cập nhật danh mục
router.put("/update-category/:id", verifyToken, updateCategoryController);

//Lấy tất cả danh mục
router.get("/get-category", categoryController);

//Lấy danh mục
router.get("/single-category/:slug", singleCategoryController);
// Xóa danh mục
router.delete("/delete-category/:id", verifyToken, deleteCategoryController);

export default router;
