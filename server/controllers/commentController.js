import commentModel from "../models/comment.model.js";

export const createCommentController = async (req, res) => {
  try {
    const { content, productId, userId } = req.body;

    if (userId !== req.user.id && userId !== req.user._id) {
      return res.status(403).send({
        success: false,
        message: "Bạn không được phép bình luận",
      });
    }
    const newComment = new commentModel({
      content,
      productId,
      userId,
    });
    await newComment.save();
    res.status(200).send({
      success: true,
      message: "Tạo bình luận thành công",
      newComment,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Lỗi khi tạo bình luận",
      error,
    });
  }
};

//Lấy bình luận
export const getProductCommentCotroller = async (req, res) => {
  try {
    const comments = await commentModel
      .find({
        productId: req.params.pId,
      })
      .sort({
        createdAt: -1,
      });
    res.status(200).send({
      success: true,
      message: "Lấy bình luận thành công",
      comments,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "lỗi khi lấy bình luận",
      error,
    });
  }
};
//Phần like trong bình luận
export const likeCommentController = async (req, res) => {
  try {
    const comment = await commentModel.findById(req.params.commentId);
    if (!comment) {
      res.status(404).send({
        success: false,
        message: "không tìm thấy bài viết",
      });
    }
    const userIndex = comment.likes.indexOf(req.user.id || req.user._id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id || req.user._id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).send({
      success: true,
      message: "Like bình luận thành công",
      comment,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Lỗi khi like bình luận",
      error,
    });
  }
};
//Chỉnh sữa bình luận
export const editCommentController = async (req, res) => {
  try {
    console.log(req.params.commentId);
    const comment = await commentModel.findById(req.params.commentId);
    if (!comment) {
      res.status(404).send({
        success: false,
        message: "không tìm thấy bình luận",
      });
    }
    if (
      comment.userId !== req.user.id &&
      !req.user.isAdmin &&
      comment.userId !== req.user._id
    ) {
      res.status(403).send({
        success: false,
        message: "Bạn không được phép chỉnh sữa bình luận",
      });
    }
    const editedComment = await commentModel.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Chỉnh sữa bình luận thành công",
      editedComment,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Lỗi khi cập nhật bình luận",
      error,
    });
  }
};

//Xóa bình luận
export const deleteCommentController = async (req, res) => {
  try {
    const comment = await commentModel.findById(req.params.commentId);
    if (!comment) {
      res.status(404).send({
        success: false,
        message: "không tìm thấy bình luận",
      });
    }
    if (
      comment.userId !== req.user.id &&
      !req.user.isAdmin &&
      comment.userId !== req.user._id
    ) {
      res.status(403).send({
        success: false,
        message: "Bạn không được phép xóa bình luận",
      });
    }
    await commentModel.findByIdAndDelete(req.params.commentId);
    res.status(200).send({
      success: true,
      message: "Xóa bình luận thành công",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Lỗi khi cập nhật bình luận",
      error,
    });
  }
};

export const getCommentsController = async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(403).send({
      success: false,
      message: "Bạn không được phép lấy danh sách bình luận",
    });
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;
    const comments = await commentModel
      .find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await commentModel.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await commentModel.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).send({
      success: true,
      comments,
      totalComments,
      lastMonthComments,
      message: "Lấy danh sách bình luận thành cong",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Lỗi khi  lấy danh sách bình luận",
      error,
    });
  }
};
