import axios from "axios";
import { Alert, Button, Modal, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const CommentSection = ({ productId }) => {
  const { currentUser } = useSelector((state) => state.user);
  //Lưu bình luận
  const [comment, setComment] = useState("");
  //Trạng thái có lỗi hay không
  const [commentError, setCommentError] = useState(null);
  //Lấy các bình luận từ csdl
  const [comments, setComments] = useState([]);
  //cảnh báo Thu hồi bình luận
  const [showModal, setShowModal] = useState(false);
  //Thu hồi bình luận
  const [commentToDelete, setCommentToDelete] = useState(null);

  const navigate = useNavigate();

  //Xữ lý gữi dữ liệu bình luận
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (comment.length > 200) {
        return;
      }
      const res = await axios.post("/api/comment/create-comment", {
        content: comment,
        productId,
        userId: currentUser.user._id,
      });
      const data = res.data;
      console.log(data);
      if (data.success) {
        setComment("");
        setCommentError(null);
        setComments([data.newComment, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  //Lấy bình luận
  const getComments = async () => {
    try {
      const res = await axios.get(
        `/api/comment/getProductComments/${productId}`
      );
      const data = res.data;
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getComments();
  }, [productId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser.user) {
        navigate("/sign-in");
        return;
      }
      const res = await axios.put(`/api/comment/likeComment/${commentId}`);
      if (res.data.success) {
        const data = res.data;
        console.log(data);
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.comment.likes,
                  numberOfLikes: data.comment.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //Render lại mảng bình luận khi cập nhật
  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser.user) {
        navigate("/sign-in");
        return;
      }
      const res = await axios.delete(`/api/comment/deleteComment/${commentId}`);
      const data = res.data;
      if (data.success) {
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log(comments);
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser?.user ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Đăng ký với tư cách là</p>
          <img
            className="h-5 w-25 object-cover rounded-full"
            src={currentUser?.user.profilePicture}
            alt=""
          />
          <Link
            to={"/dashboard?tag=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser?.user.username}
          </Link>
        </div>
      ) : (
        <div className="text-teal-500 text-sm my-5 flex gap-1">
          "Bạn phải đăng nhập để bình luận"
          <Link className="text-blue-500 hover:underline" to="/sign-in">
            Đăng nhập
          </Link>
        </div>
      )}

      {currentUser?.user && (
        <>
          <form
            className="border border-teal-500 rounded-md p-3"
            onSubmit={handleSubmit}
          >
            <Textarea
              placeholder="Viết bình luận vào đây"
              rows={3}
              maxLength="200"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <div className="flex items-center justify-between mt-5">
              <p>{200 - comment.length} từ còn lại</p>
              <Button color="blue" type="submit">
                Gữi
              </Button>
            </div>

            {commentError && (
              <Alert color="faiture" className="mt-5">
                {commentError}
              </Alert>
            )}
          </form>
          {comments?.length === 0 ? (
            <p className="text-sm my-5">Chưa có bình luận</p>
          ) : (
            <>
              <div className="text-sm my-5 flex items-center gap-1">
                <p>Các bình luận</p>
                <div className="border border-gray-400 px-1 py-2 rounded-sm">
                  <p>{comments?.length}</p>
                </div>
              </div>

              {comments.map((comment) => (
                <Comment
                  comment={comment}
                  onLike={handleLike}
                  onEdit={handleEdit}
                  onDelete={(commentId) => {
                    setShowModal(true);
                    setCommentToDelete(commentId);
                  }}
                />
              ))}
            </>
          )}
        </>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Bạn có chắc muốn xóa bình luận này?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDelete(commentToDelete)}
              >
                Vâng, xóa
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Không, Hủy
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CommentSection;
