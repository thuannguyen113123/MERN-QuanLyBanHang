import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

const UpdateProduct = () => {
  //Lưu file ảnh up lên firebase
  const [file, setFile] = useState(null);

  //Lưu trạng thái up load ảnh
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);

  //Lưu dữ liệu
  const [formData, setFormData] = useState({});

  //Lưu danh mục
  const [categories, setCategories] = useState([]);

  //Lưu trạng thái thêm có lỗi hay không
  const [updateError, setUpdateError] = useState(null);

  //Lấy id sản phẩm truyền trên params
  const { pId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const fetchProduct = async () => {
        const res = await axios.get(`/api/product/get-product?pId=${pId}`);
        const data = await res.data;
        if (!data.success) {
          console.log(data.message);
          setUpdateError(data.message);
          return;
        }
        if (data.success) {
          setUpdateError(null);
          setFormData(data.products[0]);
        }
      };

      fetchProduct();
    } catch (error) {
      console.log(error.message);
    }
  }, [pId]);

  //Lấy danh mục
  const getAllCategory = async () => {
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

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Vui lòng chọn 1 ảnh");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Tải ảnh thất bại");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Tải ảnh thất bại");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  console.log(formData);

  //cập nhật sản phẩm
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `/api/product/update-product/${pId}`,
        formData
      );
      const data = res.data;
      if (!data.success) {
        setUpdateError(data.message);
        return;
      }
      if (data.success) {
        setUpdateError(null);
        navigate(`/product/${data.products.slug}`);
      }
    } catch (error) {
      setUpdateError(error.message);
    }
  };

  console.log(formData.category?.name);
  return (
    <div className="max-w-3xl min-h-screen mx-auto p-3">
      <h1 className="text-3xl my-7 text-center font-bold">Cập nhật sản phẩm</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <TextInput
            type="text"
            placeholder="Nhập tên sản phẩm"
            className="flex-1"
            id="titleProduct"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Select
            value={formData.category?._id || ""}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="" defaultValue>
              Lựa chọn danh mục
            </option>
            {categories &&
              categories.map((item, index) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
          </Select>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <TextInput
            type="number"
            placeholder="Nhập giá sản phẩm"
            className="flex-1"
            id="priceProduct"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
          {/* <TextInput
            type="number"
            placeholder="Nhập số lượng sản phẩm"
            className="flex-1"
            id="quantityProduct"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
          /> */}
        </div>
        <div className="flex gap-4 justify-between items-center border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            className="flex-1"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            color="blue"
            size="sm"
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Tải ảnh"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="Tải ảnh"
            className="w-full h-72 object-cover"
          />
        )}

        <textarea
          placeholder="Hãy viết mô tả vào đây."
          className="h-60 mb-12"
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <Button type="submit" color="blue">
          Cập nhật sản phẩm
        </Button>
        {updateError && (
          <Alert className="mt-5" color="failure">
            {updateError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default UpdateProduct;
