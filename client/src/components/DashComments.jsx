import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [listComment, setListComment] = useState([]);

  //Phan trang
  const [showMore, setShowMore] = useState(true);

  //Modal xóa Comment
  const [showModal, setShowModal] = useState(false);

  //Lưu id của Comment đã chọn
  const [commentIdToDelete, setCommentIdToDelete] = useState([]);
  //Lấy Comment
  const getAllComment = async () => {
    try {
      const { data } = await axios.get(`/api/comment/getcomments`);
      if (data.success) {
        setListComment(data.comments);
      }
      if (data.comments.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Reload lại k nhận dữ liễu mới
  useEffect(() => {
    if (currentUser.user.isAdmin) {
      getAllComment();
    }
  }, [currentUser.user._id]);

  //Phân tran hiển thị thêm
  const handleShowMore = async () => {
    const startIndex = listComment.length;
    try {
      const { data } = await axios.get(
        `/api/comment/getcomments?startIndex=${startIndex}&limit=9`
      );

      if (data.success) {
        setListComment((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Xữ lý xóa bài viết
  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await axios.delete(
        `/api/comment/deleteComment/${commentIdToDelete}`
      );
      const data = res.data;
      if (!data.success) {
        console.log(data.massage);
      } else {
        setListComment((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.massage);
    }
  };
  return (
    <>
      <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        {currentUser.user.isAdmin && listComment.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Ngày bình luận</Table.HeadCell>
                <Table.HeadCell>Nội dung bình luận</Table.HeadCell>
                <Table.HeadCell>Số lượng thích</Table.HeadCell>
                <Table.HeadCell>ID sản phẩm</Table.HeadCell>
                <Table.HeadCell>ID người dùng</Table.HeadCell>
                <Table.HeadCell>Xóa</Table.HeadCell>
              </Table.Head>
              {listComment.map((comment) => (
                <Table.Body className="divide-y" key={comment._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{comment.content}</Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    <Table.Cell>{comment.productId}</Table.Cell>
                    <Table.Cell>{comment.userId}</Table.Cell>

                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setCommentIdToDelete(comment._id);
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
            {showMore && (
              <button
                onClick={handleShowMore}
                className="w-full text-teal-500 self-center text-sm py-7"
              >
                Hiển thị thêm
              </button>
            )}
          </>
        ) : (
          "Không có bình luận nào"
        )}
        {/* //Modal Xóa */}
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
                Bạn có chắc muốn xóa bình luận này
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteComment}>
                  Đồng ý, xóa
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  Không, hủy
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default DashComments;
