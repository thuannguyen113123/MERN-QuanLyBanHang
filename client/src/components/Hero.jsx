import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css";
import { Navigation } from "swiper/modules";
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";
import axios from "axios";
import { Link } from "react-router-dom";

const Hero = () => {
  const [recentProducts, setRecentProducts] = useState(null);
  useEffect(() => {
    try {
      const getRecentProdcuts = async () => {
        const res = await axios.get(`/api/product/get-product?limit=4`);
        const data = await res.data;

        if (data.success) {
          setRecentProducts(data.products);
        }
      };
      getRecentProdcuts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  return (
    <div>
      <Swiper
        className="relative  group swiper-component"
        modules={[Navigation]}
        spaceBetween={50}
        slidesPerView={1}
        navigation={{
          nextEl: ".button-next-slide",
          prevEl: ".button-prev-slide",
        }}
      >
        {recentProducts &&
          recentProducts.map((product) => (
            <SwiperSlide key={product._id}>
              <div className="relative">
                <div
                  className="relative h-[50vh] w-full bg-cover bg-center overflow-hidden"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url(${product.image})`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                    <div>
                      <h1 className="text-4xl font-bold mb-4">
                        {product.name}
                      </h1>
                      <h3 className="text-[16px] font-bold inline-block py-[6px] px-[12px] rounded-xl border-[1px] text-white">
                        <Link to={`/category/${product?.category?.slug}`}>
                          {product?.category.name}
                        </Link>
                      </h3>
                      <p className="text-lg mb-6">{product.description}</p>
                      <button className="bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-300">
                        <Link to={`/product/${product.slug}`}>
                          Xem chi tiết
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        <div className="absolute top-[50%]  button-next-slide z-10 group-hover:left-0 -left-[23rem] duration-500 w-[40px] h-[40px] bg-black grid place-items-center text-white">
          <HiOutlineArrowNarrowLeft />
        </div>
        <div className="absolute top-[50%] button-prev-slide z-10  group-hover:right-0 -right-[23rem] duration-500 w-[40px] h-[40px] bg-black grid place-items-center text-white">
          <HiOutlineArrowNarrowRight />
        </div>
      </Swiper>
    </div>
  );
};

export default Hero;
