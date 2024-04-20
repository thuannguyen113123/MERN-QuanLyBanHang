import axios from "axios";
import { Alert, Button, TextInput } from "flowbite-react";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const CreatePromotion = () => {
  //Lưu dữ liệu
  const [formData, setFormData] = useState({});
  //Lưu trạng thái thêm có lỗi hay không
  const [addError, setAddError] = useState(null);
  const [randomPromotionCode, setRandomPromotionCode] = useState("");
  const [endDate, setEndDate] = useState(new Date());

  const navigate = useNavigate();

  //Hàm random mã khuyến mãi
  const generateRandomPromotionCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.codePromotion) {
        toast.error("Vui lòng nhập hoặc tạo mã khuyến mãi");
        return;
      }
      if (!formData.endDate) {
        toast.error("Vui lòng chọn ngày hết hạn");
        return;
      }
      if (!formData.discount) {
        toast.error("Vui lòng nhập phân trăm giảm");
        return;
      }
      if (!formData.quantityPromotion) {
        toast.error("Vui lòng nhập số lần dùng mã");
        return;
      }

      const res = await axios.post("/api/promotion/create-promotion", formData);
      const data = res.data;
      if (!data.success) {
        setAddError(data.message);
        return;
      }
      if (data.success) {
        setAddError(null);
        console.log(data);
        navigate("/dashboard?tab=promotion");
      }
    } catch (error) {
      setAddError(error.message);
    }
  };

  const handleRandomPromotionCode = () => {
    const code = generateRandomPromotionCode();
    setRandomPromotionCode(code);
    setFormData({ ...formData, codePromotion: code });
  };

  return (
    <div className="max-w-3xl min-h-screen mx-auto p-3">
      <h1 className="text-3xl my-7 text-center font-bold">Tạo sản phẩm</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <TextInput
            type="text"
            placeholder="Nhập mã khuyến mãi"
            className="flex-1"
            id="titlePromotionProduct"
            value={formData.codePromotion || randomPromotionCode}
            onChange={(e) =>
              setFormData({ ...formData, codePromotion: e.target.value })
            }
          />
          <Button onClick={handleRandomPromotionCode}>
            Tạo mã khuyến mãi ngẫu nhiên
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <DatePicker
            placeholderText="Ngày kết thúc"
            className="flex-1"
            selected={endDate}
            onChange={(date) => {
              setEndDate(date);
              setFormData({ ...formData, endDate: date });
            }}
            minDate={new Date()}
            showYearDropdown
            showMonthDropdown
            dateFormat="dd/MM/yyyy"
          />
          <TextInput
            type="number"
            placeholder="Nhập phần trăm giảm giá (từ 1 đến 100)"
            className="flex-1"
            min="1"
            max="100"
            id="discountPromotionPercent"
            onChange={(e) =>
              setFormData({ ...formData, discount: e.target.value })
            }
          />
          <TextInput
            type="number"
            placeholder="số lượng mã giảm gí)"
            className="flex-1"
            id="quantityPromotionPercent"
            onChange={(e) =>
              setFormData({ ...formData, quantityPromotion: e.target.value })
            }
          />
        </div>

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

export default CreatePromotion;
