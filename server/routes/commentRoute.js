import express from "express";
import {
  createCommentController,
  getProductCommentCotroller,
  likeCommentController,
  editCommentController,
  deleteCommentController,
  getCommentsController,
} from "../controllers/commentController.js";
import { verifyToken } from "./../utils/verifyUser.js";

const router = express.Router();

//tạo bình luận
router.post("/create-comment", verifyToken, createCommentController);
//Lấy bình luận
router.get("/getProductComments/:pId", getProductCommentCotroller);
//Phần like
router.put("/likeComment/:commentId", verifyToken, likeCommentController);
//Chỉnh sữa bình luận
router.put("/editComment/:commentId", verifyToken, editCommentController);
// xóa bình luận
router.delete(
  "/deleteComment/:commentId",
  verifyToken,
  deleteCommentController
);

router.get("/getcomments", verifyToken, getCommentsController);

export default router;
