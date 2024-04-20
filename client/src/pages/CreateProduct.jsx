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
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const CreateProduct = () => {
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
  const [addError, setAddError] = useState(null);

  const navigate = useNavigate();

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
      setImageUploadError("tải ảnh thất bại");
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  console.log(formData);

  //Thêm sản phẩm
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.category) {
        toast.error("Vui lòng chọn danh mục");
        return;
      }
      if (!formData.size) {
        toast.error("Vui lòng chọn size giày");
        return;
      }
      const res = await axios.post("/api/product/create-product", formData);
      const data = res.data;
      if (!data.success) {
        setAddError(data.message);
        return;
      }
      if (data.success) {
        setAddError(null);
        console.log(data);
        navigate(`/product/${data.products.slug}`);
      }
    } catch (error) {
      setAddError(error.message);
    }
  };

  return (
    <div className="max-w-3xl min-h-screen mx-auto p-3">
      <h1 className="text-3xl my-7 text-center font-bold">Tạo sản phẩm</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <TextInput
            type="text"
            placeholder="Nhập tên sản phẩm"
            className="flex-1"
            id="titleProduct"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="" defaultValue>
              Lựa chọn danh mục
            </option>
            {categories.map((item, index) => (
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
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
          <TextInput
            type="number"
            placeholder="Nhập số lượng sản phẩm"
            className="flex-1"
            id="quantityProduct"
            onChange={(e) =>
              setFormData({ ...formData, quantityForSize: e.target.value })
            }
          />
          <Select
            id="sizeProduct"
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          >
            <option value="" defaultValue>
              Lựa chọn kích thước
            </option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
          </Select>
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
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <Button type="submit" color="blue">
          Thêm sản phẩm
        </Button>
        {addError && (
          <Alert className="mt-5" color="failure">
            {addError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default CreateProduct;
