import axios from "axios";
import { Alert, Button, Modal, Select, Table, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const SizeProduct = () => {
  const { pId } = useParams();
  const [productSizes, setProductSizes] = useState([]);

  //Modal xóa sản phẩm
  const [showModal, setShowModal] = useState(false);
  //Modal thêm
  const [showModalAdd, setShowModalAdd] = useState(false);

  //Lưu id của sản phẩm đã chọn
  const [sizeIdToDelete, setSizeIdToDelete] = useState([]);

  const [error, setError] = useState(null);

  //Lưu size và số lượng sản phẩm
  const [size, setSize] = useState();
  const [quantity, setQuantity] = useState();

  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [sizeIdToUpdate, setSizeIdToUpdate] = useState(null); // Lưu ID của sản phẩm cần cập nhật
  const [sizeToUpdate, setSizeToUpdate] = useState(""); // Lưu thông tin kích thước cần cập nhật
  const [quantityToUpdate, setQuantityToUpdate] = useState(""); // Lưu thông tin số lượng cần cập nhật

  const getAllSizeProduct = async () => {
    try {
      const { data } = await axios.get(`/api/product/size-product/${pId}`);
      if (data.success) {
        setProductSizes(data.sizeProduct);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllSizeProduct();
  }, [pId]);

  const handleDeleteSize = async () => {
    setShowModal(false);
    try {
      const res = await axios.delete(
        `/api/product/delete-sizeProduct/${sizeIdToDelete}`
      );
      const data = res.data;
      if (!data.success) {
        console.log(data.massage);
      } else {
        setProductSizes((prev) =>
          prev.filter((sizeProduct) => sizeProduct._id !== sizeIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.massage);
    }
  };

  //Thêm size sản phẩm
  const handleInsertSizeProduct = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/product/create-sizeProduct`, {
        productId: pId,
        size,
        quantity,
      });
      if (data?.success) {
        // Tạo một bản sao mới của mảng size và thêm size mới vào đó
        const newSize = data.newSize;
        setProductSizes((prevSize) => prevSize.concat(newSize));
        // Đóng modal sau khi thêm thành công
        setShowModal(false);
        setSize("");
      } else {
        setShowModal(false);
        setError(data.error);
      }
    } catch (error) {
      setShowModal(false);
      setError("Lỗi trùng size khi thêm size sản phẩm");
      console.log(error);
    }
  };

  const handleUpdateSize = async () => {
    try {
      const res = await axios.put(
        `/api/product/update-sizeProduct/${sizeIdToUpdate}`,
        {
          size: sizeToUpdate,
          quantity: quantityToUpdate,
        }
      );
      const data = res.data;
      if (!data.success) {
        setError(data.error);
      } else {
        // Cập nhật lại dữ liệu trong bảng sau khi cập nhật thành công
        setProductSizes((prev) =>
          prev.map((sizeProduct) => {
            if (sizeProduct._id === sizeIdToUpdate) {
              return {
                ...sizeProduct,
                size: sizeToUpdate,
                quantity: quantityToUpdate,
              };
            }
            return sizeProduct;
          })
        );
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto max-w-xl mx-auto min-h-screen overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <Table hoverable className="shadow-md">
        <Table.Head>
          <Table.HeadCell>Size</Table.HeadCell>
          <Table.HeadCell>Số lượng </Table.HeadCell>
          <Table.HeadCell>Xóa</Table.HeadCell>
          <Table.HeadCell>Chỉnh sửa</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {productSizes.map((item) => (
            <Table.Row
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
              key={item._id}
            >
              <Table.Cell>{item.size}</Table.Cell>
              <Table.Cell>{item.quantity}</Table.Cell>
              <Table.Cell>
                <span
                  onClick={() => {
                    setShowModal(true);
                    setSizeIdToDelete(item._id);
                  }}
                  className="font-medium text-red-500 hover:underline cursor-pointer"
                >
                  Delete
                </span>
              </Table.Cell>
              <Table.Cell>
                <span
                  onClick={() => {
                    setShowModalUpdate(true);
                    setSizeIdToUpdate(item._id);
                    setSizeToUpdate(item.size); // Gán giá trị mặc định cho sizeToUpdate khi modal cập nhật mở
                    setQuantityToUpdate(item.quantity); // Gán giá trị mặc định cho quantityToUpdate khi modal cập nhật mở
                  }}
                  className="text-teal-500 hover:underline"
                >
                  Cập nhật
                </span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Button
        onClick={() => {
          setShowModalAdd(true);
        }}
        color="blue"
        className="mt-5 px-8 mx-auto"
      >
        Thêm size
      </Button>
      {error && <Alert color="failure">{error}</Alert>}
      {/* Modal thêm  */}
      <Modal
        show={showModalAdd}
        onClose={() => setShowModalAdd(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Bạn có muốn size thêm sản phẩm này
            </h3>
            <Select value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="" defaultValue>
                Lựa chọn kích thước
              </option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </Select>
            <TextInput
              type="number"
              placeholder="Nhập số size sản phẩm"
              className="flex-1 my-5"
              id="quantitySizeProduct"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleInsertSizeProduct}>
                Đồng ý, thêm
              </Button>
              <Button color="gray" onClick={() => setShowModalAdd(false)}>
                Không, hủy
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
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
              <Button color="failure" onClick={handleDeleteSize}>
                Đồng ý, xóa
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Không, hủy
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* // Modal cho chức năng cập nhật */}
      <Modal
        show={showModalUpdate}
        onClose={() => setShowModalUpdate(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Cập nhật size sản phẩm
            </h3>
            <Select
              value={sizeToUpdate}
              onChange={(e) => setSizeToUpdate(e.target.value)}
            >
              <option value="" disabled>
                Lựa chọn kích thước
              </option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </Select>
            <TextInput
              type="number"
              placeholder="Nhập số lượng sản phẩm"
              className="flex-1 my-5"
              id="quantitySizeProduct"
              value={quantityToUpdate}
              onChange={(e) => setQuantityToUpdate(e.target.value)}
            />

            <div className="flex justify-center gap-4">
              <Button color="teal" onClick={handleUpdateSize}>
                Đồng ý, cập nhật
              </Button>
              <Button color="gray" onClick={() => setShowModalUpdate(false)}>
                Không, hủy
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      ;
    </div>
  );
};

export default SizeProduct;
