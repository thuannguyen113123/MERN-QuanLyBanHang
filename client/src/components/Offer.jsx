import React, { useState, useEffect } from "react";
import axios from "axios";

const Offer = () => {
  const [promotion, setPromotion] = useState(null); // Khởi tạo là null thay vì một mảng rỗng

  const getPromotion = async () => {
    try {
      const { data } = await axios.get(`/api/promotion/get-promotions`);
      if (data.success && data.promotions.length > 0) {
        setPromotion(data.promotions[0]); // Lấy phần tử đầu tiên từ mảng promotions
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPromotion();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <section
      className="relative max-w-9xl mx-auto mt-16px"
      style={{
        backgroundImage: `url("https://nhadepso.com/wp-content/uploads/2022/10/thiet-ke-shop-quan-ao-nam-4.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "400px",
      }}
    >
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white bg-black bg-opacity-70">
        <h2 className="font-bold text-4xl">Giảm giá mùa hè</h2>

        {promotion && (
          <div key={promotion._id}>
            <h3 className="text-3xl">{promotion.codePromotion}</h3>
            <h3 className="text-3xl">
              Hết hạn: {formatDate(promotion.endDate)}
            </h3>
            <h3 className="text-2xl">
              Áp dụng với: {promotion.quantityPromotion} khách hàng đầu tiên{" "}
            </h3>
          </div>
        )}

        <button className="bg-gray-900 text-white p-4 rounded-xl mt-4">
          Đến với cửa hàng
        </button>
      </div>
    </section>
  );
};

export default Offer;
