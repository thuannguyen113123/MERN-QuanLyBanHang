import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashProduct = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [listProduct, setListProduct] = useState([]);

  //Phan trang
  const [showMore, setShowMore] = useState(true);

  //Modal xóa sản phẩm
  const [showModal, setShowModal] = useState(false);

  //Lưu id của sản phẩm đã chọn
  const [productIdToDelete, setProductIdToDelete] = useState([]);

  //Lấy sản phẩm
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`/api/product/get-product?limit=9`);
      if (data.success) {
        setListProduct(data.products);
      }
      if (data.products.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Reload lại k nhận dữ liễu mới
  useEffect(() => {
    if (currentUser.user.isAdmin) {
      getAllProducts();
    }
  }, [currentUser.user._id]);

  //Phân tran hiển thị thêm
  const handleShowMore = async () => {
    const startIndex = listProduct.length;
    try {
      const { data } = await axios.get(
        `/api/product/get-product?startIndex=${startIndex}&limit=9`
      );

      if (data.success) {
        setListProduct((prev) => [...prev, ...data.products]);
        if (data.products.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Xữ lý xóa bài viết
  const handleDeleteProduct = async () => {
    setShowModal(false);
    try {
      const res = await axios.delete(
        `/api/product/delete-product/${productIdToDelete}`
      );
      const data = res.data;
      if (!data.success) {
        console.log(data.massage);
      } else {
        setListProduct((prev) =>
          prev.filter((product) => product._id !== productIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.massage);
    }
  };
  return (
    <>
      <div className="table-auto  overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        {currentUser.user.isAdmin && listProduct.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Ngày đăng</Table.HeadCell>
                <Table.HeadCell>Ảnh sản phẩm</Table.HeadCell>
                <Table.HeadCell>Tên sản phẩm</Table.HeadCell>
                <Table.HeadCell>Danh mục</Table.HeadCell>
                <Table.HeadCell>Giá</Table.HeadCell>
                <Table.HeadCell>Cập nhật size và số lượng</Table.HeadCell>
                <Table.HeadCell>Xóa</Table.HeadCell>
                <Table.HeadCell>
                  <span>Cập nhật</span>
                </Table.HeadCell>
              </Table.Head>
              {listProduct.map((product) => (
                <Table.Body className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {" "}
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/product/${product.slug}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-10 object-cover bg-gray-500"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="font-medium text-gray-900 dark:text-white"
                        to={`/product/${product.slug}`}
                      >
                        {product.name}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{product?.category?.name}</Table.Cell>
                    <Table.Cell>
                      {" "}
                      {parseFloat(product.price).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="text-teal-500 hover:underline"
                        to={`/size-product/${product._id}`}
                      >
                        <span>Thay đổi size và số lượng</span>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setProductIdToDelete(product._id);
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="text-teal-500 hover:underline"
                        to={`/update-product/${product._id}`}
                      >
                        <span>Edit</span>
                      </Link>
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
          "Không có sản phẩm"
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
                Bạn có chắc muốn xóa sản phẩm này
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteProduct}>
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

export default DashProduct;
