import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Breadcrum from "../components/Breadcrum";
import CommentSection from "../components/CommentSection";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cart/cartSlice";
import ItemProduct from "../components/ItemProduct";

const ProductDetail = () => {
  const { pSlug } = useParams();
  //Lưu trạng thái load
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [product, setProduct] = useState([]);
  //Sản phẩm mới
  const [relatedProducts, setRelatedProducts] = useState(null);

  const [quantity, setQuantity] = useState(1);
  //Lưu size sản phẩm
  const [productSizes, setProductSizes] = useState([]);
  //Lưu trạng thái chọn size
  const [sizeState, setSizeState] = useState();

  const dispatch = useDispatch();

  //Giảm số lượng
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // tăng số lượng
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const getProductDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/product/get-product?pSlug=${pSlug}`);
      const data = res.data;
      if (!data.success) {
        setError(true);
        setLoading(false);
        return;
      }
      if (data.success) {
        setProduct(data.products[0]);
        setLoading(false);
        setError(false);
      }
    } catch (error) {
      setError(true);
      setLoading(false);
      console.log(error);
    }
  };
  const getAllSizeProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/product/size-product/${product._id}`
      );
      if (data.success) {
        setProductSizes(data.sizeProduct);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProductDetail();
  }, [pSlug]);

  useEffect(() => {
    if (product && product._id) {
      getAllSizeProduct();
    }
  }, [product]);

  useEffect(() => {
    try {
      const getRelatedProdcuts = async () => {
        if (product && product.category && product.category._id) {
          const res = await axios.get(
            `/api/product/get-product?category=${product.category._id}&limit=4`
          );
          const data = await res.data;

          if (data.success) {
            setRelatedProducts(data.products);
          }
        }
      };
      getRelatedProdcuts();
    } catch (error) {
      console.log(error.message);
    }
  }, [product]);

  //Load trang sẽ hiện Spiner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  const handleAddToCart = () => {
    const quantityProduct = quantity;
    const sizeProduct = sizeState;

    const productToAdd = {
      ...product,
      quantity: quantityProduct,
      size: sizeProduct,
    };

    dispatch(addToCart(productToAdd));
  };

  const formattedPrice = product.price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return (
    <>
      {/* md:gap-[6px] md:flex-row */}
      <div className="max-w-7xl mx-auto ">
        <Breadcrum ProductDetail={product} />
        <div className="flex flex-col gap-14 xl:flex-row">
          <div className="flex gap-2">
            <div className="flex flex-col gap-[7px] flex-wrap">
              <img
                className="h-[120px] lg:h-[120px] sm:h-[70px]"
                src={product.image}
                alt="sản phẩm chi tiết"
              />
              <img
                className="h-[120px] lg:h-[120px] sm:h-[70px]"
                src={product.image}
                alt="sản phẩm chi tiết sm:h-[70px]"
              />
              <img
                className="h-[120px] lg:h-[120px] sm:h-[70px]"
                src={product.image}
                alt="sản phẩm chi tiết"
              />
              <img
                className="h-[120px] lg:h-[120px] sm:h-[70px]"
                src={product.image}
                alt="sản phẩm chi tiết"
              />
            </div>
            <div className="w-[500px] h-[50px]  lg:w-[500px] lg:h-[500px] sm:w-[280px] sm:h-[370px]">
              <img
                className="w-full h-full object-cover"
                src={product.image}
                alt="sản phẩm chi tiết"
              />
            </div>
          </div>
          <div className="flex flex-col mx-10 gap-4">
            <h1 className="font-bold text-[28px]">{product.name}</h1>

            <div className="flex gap-4 text-[20px]">
              <div>{formattedPrice}</div>
            </div>
            <div
              className="text-[16px]"
              dangerouslySetInnerHTML={{ __html: product.description }}
            ></div>
            <div className="flex gap-4 items-center mb-[10px]">
              <p className="text-gray-400 font-semibold text-[18px]">
                Số lượng:{" "}
              </p>
              <div className="flex items-center">
                <button
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-l focus:outline-none dark:text-gray-500"
                  onClick={decreaseQuantity}
                >
                  -
                </button>
                <div className="border-t border-b border-gray-200 px-3 py-1">
                  {quantity}
                </div>
                <button
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-r focus:outline-none dark:text-gray-500"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
            </div>

            <div className="">
              <h1 className="font-semibold">Lựa chọn size:</h1>
              <div className="flex gap-6">
                {productSizes &&
                  productSizes.map((sizeProduct) => (
                    <div
                      key={sizeProduct._id}
                      className={`ring-2 ring-slate-900 dark:ring-white h-10 w-10 flex justify-center items-center cursor-pointer ${
                        sizeState === sizeProduct.size ? "bg-blue-500" : ""
                      }`}
                      onClick={() => setSizeState(sizeProduct.size)}
                    >
                      {sizeProduct.size}
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex gap-10">
              <Button
                color="failure"
                className="text-[16px] md:w-[200px] font-semibold my-[20px] cursor-pointer sm:w-full"
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </Button>
            </div>
            <Link to={`/category/${product.category.name}`} className="">
              <span className="text-[20px] font-semibold">Danh mục: </span>
              {product.category.name}
            </Link>
            <p className="mt-2">
              <span className="text-[20px] font-semibold">Tags: </span>
            </p>
          </div>
          {/* Phần bình luận */}
        </div>
      </div>
      <div className="flex w-full max-w-6xl mx-auto">
        <CommentSection productId={product._id} className />
      </div>
      <div className=" max-w-6xl mx-auto py-12 xl:py-28 xl:w-[88%]">
        <h3 className="text-center font-bold ">Sản phẩm cùng loại</h3>
        <hr className="h-[3px] md:w-1/2 mx-auto bg-gradient-to-l from-transparent via-black to-transparent mb-16" />
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {relatedProducts &&
            relatedProducts.map((product) => (
              <ItemProduct
                product={product}
                key={product._id}
                id={product._id}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
