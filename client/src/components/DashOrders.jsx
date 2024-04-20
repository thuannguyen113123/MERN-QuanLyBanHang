import axios from "axios";
import { Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

const DashOrders = () => {
  const [orders, setOrders] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  //Phan trang
  const [showMore, setShowMore] = useState(false);
  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        "/api/auth/orders?startIndex=0&limit=10"
      );
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, [currentUser?.user.token]);
  //Phân tran hiển thị thêm
  const handleShowMore = async () => {
    const startIndex = orders.length;
    try {
      const { data } = await axios.get(
        `/api/product/get-product?startIndex=${startIndex}&limit=10`
      );

      if (data.success) {
        setOrders((prev) => [...prev, ...data]);
        if (data.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-w-6xl mx-auto">
      {orders.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>STT</Table.HeadCell>
              <Table.HeadCell>Trạng thái đơn hàng</Table.HeadCell>
              <Table.HeadCell>Người mua</Table.HeadCell>
              <Table.HeadCell>Thời gian</Table.HeadCell>
              <Table.HeadCell>Thanh toán</Table.HeadCell>
              <Table.HeadCell>Số lượng sản phẩm đơn hàng</Table.HeadCell>
            </Table.Head>
            {orders.map((order, index) => (
              <Table.Body className="divide-y" key={index}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{order.status}</Table.Cell>
                  <Table.Cell>{order.buyer.username}</Table.Cell>
                  <Table.Cell>{moment(order.createdAt).fromNow()}</Table.Cell>

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
                          {parseFloat(product.price).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Table.Cell>
                      </Table.Cell>
                    </Table.Cell>
                  ))}
                  <Table.Cell>
                    {order.infoDetail.map((detail, i) => (
                      <div key={i} className="mb-[65px]">
                        <span className="font-bold">Size:</span> {detail.size},{" "}
                        <span className="font-bold">Số lượng:</span>{" "}
                        {detail.quantity},{" "}
                        <span className="font-bold flex">
                          Tổng tiền:{" "}
                          {parseFloat(detail.total).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>{" "}
                      </div>
                    ))}
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
        <div className="mt-10">
          <p className="font-bold text-center text-[32px]">Không có đơn hàng</p>
        </div>
      )}
    </div>
  );
};

export default DashOrders;
