//Hiện thị đường dẫn hiện tại
import React from "react";
import { BsChevronRight } from "react-icons/bs";

const Breadcrum = ({ ProductDetail }) => {
  return (
    <div className="flex items-center my-5  self-center whitespace-nowrap text-sm sm:text-xl font-semibold  ">
      Trang chủ <BsChevronRight /> Thuan's Shop <BsChevronRight />{" "}
      {ProductDetail?.category?.name} <BsChevronRight /> {ProductDetail?.name}{" "}
    </div>
  );
};

export default Breadcrum;
