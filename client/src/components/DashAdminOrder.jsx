import axios from "axios";
import { Select, Table } from "flowbite-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DashAdminOrders = () => {
  const [status, setStatus] = useState([
    "Không xử lý",
    "Đang xử lý",
    "Đã vận chuyển",
    "Giao hàng",
    "Hủy",
  ]);
  const [orders, setOrders] = useState([]);
  //Phan trang
  const [showMore, setShowMore] = useState(true);

  const { currentUser } = useSelector((state) => state.user);

  //Lấy tất cả đơn hàng
  const getOrders = async () => {
    try {
      const { data } = await axios.get(`/api/auth/all-orders?limit=10`);
      console.log(data);
      setOrders(data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, [currentUser?.user.token]);

  // //Cập nhật trạng thái đơn hàng
  const handleChange = async (orderId, event) => {
    try {
      const value = event.target.value;
      // Cập nhật trạng thái của đơn hàng trong danh sách
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: value } : order
        )
      );
      const { data } = await axios.put(`/api/auth/order-status/${orderId}`, {
        status: JSON.stringify(value),
      });
      if (data.success) {
        setStatus(data.orders.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Phân tran hiển thị thêm
  const handleShowMore = async () => {
    const startIndex = orders.length;
    try {
      const { data } = await axios.get(
        `/api/auth/all-orders?startIndex=${startIndex}&limit=10`
      );
      console.log(data);
      if (data.success) {
        setOrders((prev) => [...prev, ...data.orders]);
        if (data.orders.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {orders && orders.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Trạng thái đơn hàng</Table.HeadCell>
              <Table.HeadCell>Người mua</Table.HeadCell>
              <Table.HeadCell>Thời gian</Table.HeadCell>
              <Table.HeadCell>Thanh toán</Table.HeadCell>
              <Table.HeadCell>Số lượng sản phẩm</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {orders &&
                orders.map((order, index) => (
                  <>
                    <Table.Row
                      key={index}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800 border-t-[1px] border-gray-400"
                    >
                      <Table.Cell>{order._id}</Table.Cell>
                      <Table.Cell>
                        <Select
                          onChange={(event) => handleChange(order._id, event)}
                          value={order.status}
                        >
                          <option defaultValue>{order.status}</option>
                          {status.map((s, i) => (
                            <option key={i} value={s}>
                              {s}
                            </option>
                          ))}
                        </Select>
                      </Table.Cell>
                      <Table.Cell>{order.buyer.username}</Table.Cell>
                      <Table.Cell>
                        {moment(order.createdAt).fromNow()}
                      </Table.Cell>
                      <Table.Cell>
                        {order.payment.success ? "Thành công" : "Thất bại"}
                      </Table.Cell>
                      <Table.Cell>{order.products.length}</Table.Cell>
                    </Table.Row>

                    <Table.Row className="border-t-[1px] border-gray-400">
                      {order.products.map((product) => (
                        <Table.Cell className="flex items-center">
                          <img
                            src={product.image}
                            log
                            className="w-20 h-20"
                            alt={order.products.name}
                          />
                          <Table.Cell>
                            <span className="font-bold">Tên sản phẩm:</span>{" "}
                            {product.name}{" "}
                            <Table.Cell>
                              <span className="font-bold ">Giá: </span>{" "}
                              {parseFloat(product.price).toLocaleString(
                                "vi-VN",
                                { style: "currency", currency: "VND" }
                              )}
                            </Table.Cell>
                          </Table.Cell>
                        </Table.Cell>
                      ))}
                      <Table.Cell>
                        {order.infoDetail.map((detail, i) => (
                          <div key={i} className="mb-[65px]">
                            <span className="font-bold">Size:</span>{" "}
                            {detail.size},{" "}
                            <span className="font-bold">Số lượng:</span>{" "}
                            {detail.quantity},{" "}
                            <span className="font-bold flex">
                              Tổng tiền:{" "}
                              {parseFloat(detail.total).toLocaleString(
                                "vi-VN",
                                {
                                  style: "currency",
                                  currency: "VND",
                                }
                              )}
                            </span>{" "}
                          </div>
                        ))}
                      </Table.Cell>
                    </Table.Row>
                  </>
                ))}
            </Table.Body>
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
        <div className="mt-10">
          <p className="font-bold text-center text-[32px]">Không có đơn hàng</p>
        </div>
      )}
    </div>
  );
};

export default DashAdminOrders;
