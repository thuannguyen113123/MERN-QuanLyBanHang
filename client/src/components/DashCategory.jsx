import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, Modal, Table, TextInput } from "flowbite-react";
// import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

const DashCategory = () => {
  const { currentUser } = useSelector((state) => state.user);
  //Lưu danh sách danh mục
  const [categories, setCategories] = useState([]);

  //Modal thêm danh mục
  const [showModal, setShowModal] = useState(false);

  //Modal cập nhật danh mục
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  // Modal Xóa
  const [showModalDelete, setShowModalDelete] = useState(false);

  const [name, setName] = useState("");

  //Lấy danh mục nào
  const [selected, setSelected] = useState(null);

  // //Lưu như gì muốn cập nhật
  const [updatedName, setUpdatedName] = useState("");

  //Lấy danh mục

  const getAllCategory = async () => {
    // const name

    try {
      const { data } = await axios.get(`/api/category/get-category`);
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getAllCategory();
  }, []);

  //Thêm danh mục
  const handleInsertCategory = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/category/create-category`, {
        name,
      });
      if (data?.success) {
        // Tạo một bản sao mới của mảng categories và thêm danh mục mới vào đó
        const newCategory = data.category;
        setCategories((prevCategories) => prevCategories.concat(newCategory));
        setName("");
        // Đóng modal sau khi thêm thành công
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Cập nhật danh mục

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/category/update-category/${selected}`,
        { name: updatedName }
      );
      if (data?.success) {
        setSelected(null);
        setUpdatedName("");
        setShowModalUpdate(false);
        getAllCategory();
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Xóa danh mục
  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(
        `/api/category/delete-category/${pId}`
      );
      if (data.success) {
        getAllCategory();
        setShowModalDelete(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto  md:mx-auto p-3">
      {currentUser.user.isAdmin && categories.length > 0 ? (
        <Table hoverable className="shadow-md w-full">
          <Table.Head>
            <Table.HeadCell>Ngày</Table.HeadCell>
            <Table.HeadCell>Tên danh mục</Table.HeadCell>
            <Table.HeadCell>Xóa</Table.HeadCell>
            <Table.HeadCell>Cập nhật</Table.HeadCell>
          </Table.Head>
          {categories.map((category) => (
            <Table.Body className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(category.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span
                    className="font-medium text-red-500 cursor-pointer hover:underline"
                    onClick={() => setShowModalDelete(true)}
                  >
                    Xóa
                  </span>
                  {/*  Modal Xoá */}
                  <Modal
                    show={showModalDelete}
                    onClose={() => setShowModalDelete(false)}
                    popup
                    size="md"
                  >
                    <Modal.Header />
                    <Modal.Body>
                      <div className="text-center">
                        <HiOutlineExclamationCircle className="w-12 h-12 text-gray-400 dark:text-gray-200 mx-auto mb-5" />
                        <h3 className="text-lg text-gray-500 dark:text-gray-400 mb-5">
                          Bạn có chắc muồn xóa danh mục
                        </h3>
                        <div className="flex justify-center gap-6">
                          <Button
                            color="failure"
                            onClick={() => {
                              handleDelete(category._id);
                            }}
                          >
                            Vâng, xóa
                          </Button>
                          <Button
                            color="gray"
                            onClick={() => setShowModalDelete(false)}
                          >
                            Không, hủy
                          </Button>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
                </Table.Cell>
                <Table.Cell>
                  <span
                    onClick={() => {
                      setShowModalUpdate(true);
                      setSelected(category._id);
                      setUpdatedName(category.name);
                    }}
                    className="text-teal-500 hover:underline"
                  >
                    Cập nhật
                  </span>

                  {/*  Modal Cập nhật */}
                  <Modal
                    show={showModalUpdate}
                    onClose={() => setShowModalUpdate(false)}
                    popup
                    size="md"
                  >
                    <Modal.Header />
                    <Modal.Body>
                      <div className="text-center">
                        <h3 className="text-lg text-gray-500 dark:text-gray-400 mb-5">
                          Bạn có chắc muồn cập nhật danh mục
                        </h3>
                        <form onSubmit={handleUpdate}>
                          <TextInput
                            type="text"
                            placeholder="Tên danh mục"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                          />
                          <div className="flex justify-center gap-6 mt-6">
                            <Button color="failure" type="submit">
                              Vâng, cập nhật
                            </Button>
                            <Button
                              color="gray"
                              onClick={() => setShowModalUpdate(false)}
                            >
                              Không, hủy
                            </Button>
                          </div>
                        </form>
                      </div>
                    </Modal.Body>
                  </Modal>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      ) : (
        <p>Không có danh mục nào</p>
      )}

      <div className="flex justify-between gap-8">
        <Button
          color="blue"
          className="w-full mt-5"
          onClick={() => setShowModal(true)}
        >
          Thêm Danh mục
        </Button>
        <Button color="blue" className="w-full mt-5">
          <Link to="/create-product">Thêm sản phẩm</Link>
        </Button>
      </div>
      {/* Modal thêm  */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            {/* <HiOutlineExclamationCircle className="w-12 h-12 text-gray-400 dark:text-gray-200 mx-auto mb-5" /> */}
            <h3 className="text-lg text-gray-500 dark:text-gray-400 mb-5">
              Thêm danh mục
            </h3>
            <form onSubmit={handleInsertCategory}>
              <TextInput
                type="text"
                placeholder="Tên danh mục"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="flex justify-center gap-6 mt-5">
                <Button color="blue" type="submit">
                  Vâng, Thêm
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  Không, hủy
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashCategory;
