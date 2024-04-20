import React from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const ItemProduct = ({ product }) => {
  const formattedPrice = product.price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return (
    <div
      key={product._id}
      className="rounded-xl relative overflow-hidden shadow-lg item-product-component"
    >
      <div className="flex items-center justify-center group overflow-hidden transition-all duration-100">
        <Link
          to={`/product/${product.slug}`}
          className="h-12 w-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center absolute top-1/2 bottom-1/2 !py-2 z-20 scale-0 group-hover:scale-100 transition-all duration-700"
        >
          <FaSearch className="hover:rotate-90 hover:scale-125 transition-all duration-200" />
        </Link>

        <img
          src={product.image}
          alt=""
          className="w-full block object-cover group-hover:scale-110 transition-all duration-1000"
        />
      </div>
      {/* overflow-hidden là một thuộc tính được sử dụng để quản lý hiển thị nội dung vượt ra khỏi phần tử cha của nó */}
      <div className="p-4 overflow-hidden">
        <h4 className="my-[6px] font-medium line-clamp-2 text-gray-30">
          {product.name}
        </h4>
        <div className="flex gap-5">
          <div>{formattedPrice}</div>
        </div>
      </div>
    </div>
  );
};

export default ItemProduct;
