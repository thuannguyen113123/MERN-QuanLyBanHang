import { Alert, Button, Table, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TbTrash } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import {
  clearCart,
  decreaseCart,
  getTotals,
  increaseCart,
  removeFromCart,
} from "../redux/cart/cartSlice";
import axios from "axios";
import DropIn from "braintree-web-drop-in-react";
import { toast } from "react-toastify";
const CartItem = () => {
  const cart = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.user);

  //Lưu token từ braintree
  const [clientToken, setClientToken] = useState("");
  //Lưu giao diện thanh toan(Như là pt thanh toán)
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorPayment, setErrorPayment] = useState(null);
  const [listPromotion, setListPromotion] = useState([]);

  // Khởi tạo state để theo dõi trạng thái mã giảm giá đã được áp dụng hay chưa
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  //Khuyến mãi
  const [promoCode, setPromoCode] = useState("");

  const dispatch = useDispatch();

  //Xóa sản phẩm trong giỏ hàng
  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart({ id: product._id }));
  };
  //Giảm số lượng
  const handleDecreaseQuantity = (product) => {
    dispatch(decreaseCart(product));
  };

  const handleIncreaseQuantity = (product) => {
    dispatch(increaseCart(product));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // nhận token cổng thanh toán(braintree sẽ cấp token giao dịch)
  const getToken = async () => {
    try {
      const { data } = await axios.get(`/api/product/braintree/token`);
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [currentUser?.user?.token]);

  //Xữ lý thanh toán
  const handlePayment = async () => {
    try {
      setLoading(true);

      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(`/api/product/braintree/payment`, {
        nonce,
        cart: cart.cartItems,
        total: cart.cartTotalAmount,
        listPromotion: listPromotion,
      });

      if (data.success) {
        toast.success("Thanh toán thành công");
        setLoading(false);
        dispatch(clearCart());
      } else {
        toast.error(data.message || "Thanh toán thất bại"); // Hiển thị message nếu có, nếu không thì hiển thị thông báo mặc định
        setErrorPayment(data.error);
      }
    } catch (error) {
      console.log(error);
      // toast.error("Số lượng trong kho không đủ");
      toast.error(error.message);

      setLoading(false);
    }
  };

  //Lấy các mã giảm giá
  const getAllPromotions = async () => {
    try {
      const { data } = await axios.get(`/api/promotion/get-promotions`);
      if (data.success) {
        setListPromotion(data.promotions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Reload lại k nhận dữ liễu mới
  useEffect(() => {
    getAllPromotions();
  }, []);

  const handleApplyPromotion = () => {
    if (!isPromoApplied) {
      // Kiểm tra nếu mã giảm giá chưa được áp dụng
      const promotion = listPromotion.find(
        (promo) => promo.codePromotion === promoCode
      );
      if (promotion) {
        // Tính toán giảm giá và cập nhật lại tổng tiền
        const discount = (promotion.discount / 100) * cart.cartTotalAmount;
        const newTotal = cart.cartTotalAmount - discount;
        dispatch(getTotals({ newTotal })); // Truyền newTotal vào action
        toast.success(`Đã áp dụng mã khuyến mãi ${promotion.codePromotion}`);
        setIsPromoApplied(true); // Đánh dấu rằng mã giảm giá đã được áp dụng
      } else {
        toast.error("Mã khuyến mãi không hợp lệ");
      }
    } else {
      toast.error("Mỗi đơn hàng chỉ được áp dụng mã giảm giá một lần");
    }
  };

  const handlePromoCodeChange = (event) => {
    setPromoCode(event.target.value);
  };
  useEffect(() => {
    if (isPromoApplied) {
      dispatch(getTotals({ newTotal: cart.cartTotalAmount }));
    } else {
      dispatch(getTotals());
    }
  }, [isPromoApplied, cart.cartTotalAmount, dispatch, cart]);

  // Chỉnh tiền việt
  const formattedPrice = (price) =>
    price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  return (
    <div className="max-w-6xl mx-auto my-8">
      <h3 className="font-bold text-[28px] sm:text-28px text-center my-8">
        Chi tiết giỏ hàng
      </h3>
      {cart.cartItems.length === 0 ? (
        <>
          <div className="flex justify-center">
            <img src="../../empty-cart.webp" alt="" />
          </div>
          <Link to="/" className="flex justify-center">
            <button className="flex items-center  mt-4 border-[1px] border-gray-400 p-2">
              <FaArrowLeft /> <span>Tiếp tục mua hàng</span>
            </button>
          </Link>
        </>
      ) : (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head className="bg-gray-400 text-[14px] sm:text-[18px] text-start py-12">
              <Table.HeadCell className="p-1 py-2">Tên sản phẩm</Table.HeadCell>
              <Table.HeadCell className="p-1 py-2">ảnh sản phẩm</Table.HeadCell>
              <Table.HeadCell className="p-1 py-2">Giá</Table.HeadCell>
              <Table.HeadCell className="p-1 py-2">Số lượng</Table.HeadCell>
              <Table.HeadCell className="p-1 py-2">Size</Table.HeadCell>
              <Table.HeadCell className="p-1 py-2">Tổng tiền</Table.HeadCell>
              <Table.HeadCell className="p-1 py-2">Xóa</Table.HeadCell>
            </Table.Head>
            {cart?.cartItems.map((product, index) => (
              <Table.Body>
                <Table.Row className="border-b border-slate-900/20 text-gray-20 p-6 text-[14px] text-center">
                  <Table.Cell>
                    <Link
                      className="font-medium line-clamp-3 text-gray-900 dark:text-white"
                      to={`/product/${product.slug}`}
                    >
                      {product.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {" "}
                    <Link
                      to={`/product/${product.slug}`}
                      className="flex justify-center items-center"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className=" w-14 h-14 object-cover bg-gray-500 rounded-lg ring-1 ring-slate-900/5 my-1"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{formattedPrice(product.price)}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-4 justify-center items-center mb-[10px]">
                      <div className="flex items-center">
                        <button
                          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-l focus:outline-none dark:text-gray-500"
                          onClick={() => {
                            handleDecreaseQuantity(product);
                          }}
                        >
                          -
                        </button>
                        <div className="border-t border-b border-gray-200 px-3 py-1">
                          {product.quantity}
                        </div>
                        <button
                          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-r focus:outline-none dark:text-gray-500"
                          onClick={() => {
                            handleIncreaseQuantity(product);
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>{product.size}</Table.Cell>
                  <Table.Cell>
                    {formattedPrice(product.price * product.quantity)}
                  </Table.Cell>
                  <Table.Cell>
                    <TbTrash onClick={() => handleRemoveFromCart(product)} />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          <div className="flex justify-between items-start border-t-[1px] border-gray-400 pt-[2rem]">
            <button
              onClick={() => handleClearCart()}
              className="w-[130px] max-w-[100%] h-[48px] rounded-md font-semibold border-[0.5px] border-gray-400 cursor-pointer"
            >
              Dọn giỏ hàng
            </button>
            <div className="w-270px max-w-full">
              <div className="flex justify-between items-center mb-2">
                <TextInput
                  className="flex-1"
                  placeholder="Nhập mã giảm giá"
                  value={promoCode}
                  onChange={handlePromoCodeChange}
                />
                <Button className="ml-2" onClick={handleApplyPromotion}>
                  Áp dụng
                </Button>
              </div>
              <div className="flex justify-between text-[28px]">
                <span>Tổng tiền: </span>
                <span className="font-bold">
                  {formattedPrice(cart.cartTotalAmount)}
                </span>
              </div>
              {currentUser?.user ? (
                <div>
                  <span className="text-[18px] sm:text-[14px] font-semibold mt-2">
                    Thuế và phí vận chuyển được tính khi thanh toán
                  </span>
                  <div className="w-[500px] mt-2">
                    {!clientToken || !cart?.cartItems?.length ? (
                      ""
                    ) : (
                      <>
                        <DropIn
                          options={{
                            authorization: clientToken,
                            paypal: {
                              flow: "vault",
                            },
                          }}
                          onInstance={(instance) => setInstance(instance)}
                        />

                        <button
                          onClick={handlePayment}
                          disabled={
                            loading || !instance || !currentUser?.user?.address
                          }
                          className="bg-blue-500 border-gray-950 border-[1px] px-[5px] py-[10px] text-[16px] cursor-pointer w-full rounded-lg text-white"
                        >
                          {loading ? "Đang xữ lý ...." : "Thanh toán"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <span>Vui lòng đăng nhập để có thể thanh toán</span>
                  <Link to="/sign-in">
                    <Button
                      gradientDuoTone="purpleToBlue"
                      className="w-full mt-5"
                    >
                      Đăng nhập
                    </Button>
                  </Link>
                </div>
              )}
              {errorPayment && (
                <Alert severity="error">
                  {errorPayment.message || "Có lỗi xảy ra khi thanh toán"}
                </Alert>
              )}
              <Link to="/">
                <button className="flex items-center  mt-4 border-[1px] border-gray-400 p-2">
                  <FaArrowLeft /> <span>Tiếp tục mua hàng</span>
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartItem;
