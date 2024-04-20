import axios from "axios";
import { Button, Modal, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashPromotion = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [listPromotion, setListPromotion] = useState([]);

  const [showModal, setShowModal] = useState(false);

  //Phan trang
  const [showMore, setShowMore] = useState(true);

  const [promotionIdToDelete, setPromotionIdToDelete] = useState([]);

  //Lấy sản phẩm
  const getAllPromotions = async () => {
    try {
      const { data } = await axios.get(`/api/promotion/get-promotions?limit=9`);
      if (data.success) {
        setListPromotion(data.promotions);
      }
      if (data.promotions.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Reload lại k nhận dữ liễu mới
  useEffect(() => {
    if (currentUser.user.isAdmin) {
      getAllPromotions();
    }
  }, [currentUser.user._id]);

  //Phân tran hiển thị thêm
  const handleShowMore = async () => {
    const startIndex = listPromotion.length;
    try {
      const { data } = await axios.get(
        `/api/promotion/get-promotions?startIndex=${startIndex}&limit=9`
      );

      if (data.success) {
        setListPromotion((prev) => [...prev, ...data.Promotions]);
        if (data.Promotions.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Xữ lý xóa mã giảm giá
  const handleDeletePromotion = async () => {
    setShowModal(false);
    try {
      const res = await axios.delete(
        `/api/promotion/delete-promotion/${promotionIdToDelete}`
      );
      const data = res.data;
      if (!data.success) {
        console.log(data.massage);
      } else {
        setListPromotion((prev) =>
          prev.filter((promotion) => promotion._id !== promotionIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.massage);
    }
  };
  return (
    <div className="table-auto  overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.user.isAdmin && listPromotion.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Ngày đăng</Table.HeadCell>
              <Table.HeadCell>Mã code</Table.HeadCell>
              <Table.HeadCell>Phần trăm</Table.HeadCell>
              <Table.HeadCell>Ngày kết thúc</Table.HeadCell>
              <Table.HeadCell>Trạng thái</Table.HeadCell>
              <Table.HeadCell>Số lượng còn áp dụng</Table.HeadCell>
              <Table.HeadCell>Xóa</Table.HeadCell>
            </Table.Head>
            {listPromotion.map((promotion) => (
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {" "}
                    {new Date(promotion.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{promotion.codePromotion}</Table.Cell>
                  <Table.Cell>{promotion.discount}</Table.Cell>
                  <Table.Cell>{promotion.endDate}</Table.Cell>
                  <Table.Cell>
                    {promotion.isActive ? (
                      <span className="bg-green-300 p-2 rounded-md">
                        Đang hoạt động
                      </span>
                    ) : (
                      <span className="bg-red-300 p-2 rounded-md">Hết hạn</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>{promotion.quantityPromotion}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPromotionIdToDelete(promotion._id);
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
        <p className="mt-16 font-semibold text-[32px]">
          Không có Mã khuyến mãi nào
        </p>
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
              Bạn có chắc muốn xóa mã giảm giá này!
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePromotion}>
                Đồng ý, xóa
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Không, hủy
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="flex justify-center mt-5">
        <Button color="blue" className="mt-5">
          <Link to="/create-promotion">Thêm khuyến mãi</Link>
        </Button>
      </div>
    </div>
  );
};

export default DashPromotion;
