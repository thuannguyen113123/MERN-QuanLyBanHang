import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashUser = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [listUser, setListUser] = useState([]);

  //Phan trang
  const [showMore, setShowMore] = useState(true);

  //Modal xóa user
  const [showModal, setShowModal] = useState(false);

  //Lưu id của user đã chọn
  const [userIdToDelete, setUserIdToDelete] = useState([]);
  //Lấy user
  const getAllUser = async () => {
    try {
      const { data } = await axios.get(`/api/user/getusers`);
      if (data.success) {
        setListUser(data.users);
      }
      if (data.users.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Reload lại k nhận dữ liễu mới
  useEffect(() => {
    if (currentUser.user.isAdmin) {
      getAllUser();
    }
  }, [currentUser.user._id]);

  //Phân tran hiển thị thêm
  const handleShowMore = async () => {
    const startIndex = listUser.length;
    try {
      const { data } = await axios.get(
        `/api/user/getUsers?startIndex=${startIndex}&limit=9`
      );

      if (data.success) {
        setListUser((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Xữ lý xóa bài viết
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await axios.delete(`/api/user/delete/${userIdToDelete}`);
      const data = res.data;
      if (!data.success) {
        console.log(data.massage);
      } else {
        setListUser((prev) =>
          prev.filter((user) => user._id !== userIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.massage);
    }
  };
  return (
    <>
      <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        {currentUser.user.isAdmin && listUser.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Ngày tạo</Table.HeadCell>
                <Table.HeadCell>Ảnh đại diên</Table.HeadCell>
                <Table.HeadCell>Tên người dùng</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Địa chỉ</Table.HeadCell>
                <Table.HeadCell>Số điện thoại</Table.HeadCell>
                <Table.HeadCell>Quản trị</Table.HeadCell>
                <Table.HeadCell>Xóa</Table.HeadCell>
              </Table.Head>
              {listUser.map((user) => (
                <Table.Body className="divide-y" key={user._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user?.address}</Table.Cell>
                    <Table.Cell>{user?.phone}</Table.Cell>

                    <Table.Cell>
                      {user.isAdmin ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setUserIdToDelete(user._id);
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
          "Không có tài khoản nào"
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
                Bạn có chắc muốn xóa tài khoản này
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteUser}>
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

export default DashUser;
