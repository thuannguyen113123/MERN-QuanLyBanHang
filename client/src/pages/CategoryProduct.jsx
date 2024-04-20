import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useParams } from "react-router";
import ItemProduct from "./../components/ItemProduct";

const CategoryProduct = () => {
  const [listProductCategory, setListProductByCategory] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [showMore, setShowMore] = useState(true);
  const [sortBy, setSortBy] = useState("asc");
  //Lấy danh mục trên params
  const { pSlug } = useParams();
  //Lấy danh mục
  // Lấy danh mục tương ứng với pSlug
  const getCategoryById = async () => {
    try {
      const res = await axios.get(`/api/category/single-category/${pSlug}`);
      const data = res.data;
      if (data.success) {
        setCategoryId(data.category._id);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //Lấy sản phẩm theo danh mục
  const getProductsByCategory = async () => {
    try {
      const res = await axios.get(
        `/api/product/get-product?category=${categoryId}&limit=12`
      );

      const data = res.data;
      if (data.success) {
        setListProductByCategory(data.products);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getCategoryById();
  }, [pSlug]);

  useEffect(() => {
    if (categoryId) {
      getProductsByCategory();
    }
  }, [categoryId]);

  //   hiển thị thêm sản phẩm
  const handleShowMore = async () => {
    const startIndex = listProductCategory.length;
    try {
      const { data } = await axios.get(
        `/api/product/get-product?category=${categoryId}&startIndex=${startIndex}&limit=12`
      );

      if (data.success) {
        setListProductByCategory((prev) => [...prev, ...data.products]);
        if (data.products.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const sortProducts = (type) => {
    const sortedProducts = [...listProductCategory];
    sortedProducts.sort((a, b) => {
      if (type === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    setListProductByCategory(sortedProducts);
  };

  return (
    <div className="max-w-7xl mx-auto min-h-screen py-6 xl:py-12">
      <div>
        <div>
          <img
            src="https://cdn.dribbble.com/users/3369843/screenshots/6939031/nike_shoe_banner.jpg"
            alt=""
            className="block my-2 mx-auto w-full object-cover h-[350px]"
          />
        </div>
        <div className="flex justify-between my-8 mx-2">
          <h5>
            <span>Đang hiển thị 1-12</span>
            trên {listProductCategory.length} sản phẩm
          </h5>
          {/* ring-1  để tạo ra một vòng viền xung quanh một phần tử khi nó được focus hoặc hover, */}
          <div>
            <select
              className="flex items-center justify-between max-sm:p-4 gap-4 px-8 py-3 ring-1 rounded-3xl ring-slate-900/15 text-black"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                sortProducts(e.target.value);
              }}
            >
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {listProductCategory.map((product) => (
            <ItemProduct key={product._id} product={product} />
          ))}
          {listProductCategory.length === 0 && (
            <p>Không có sản phẩm nào được tìm thấy.</p>
          )}
        </div>
        {showMore && (
          <div className="mt-16 text-center">
            <button
              onClick={handleShowMore}
              className="bg-gray-950 px-4 py-2 rounded-3xl text-white"
            >
              Hiển thị thêm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProduct;
