import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  cartItems: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Thêm giỏ hàng
    addToCart(state, action) {
      const { quantity, size } = action.payload;
      if (!size) {
        toast.error("Vui lòng chọn size trước khi thêm vào giỏ hàng");
      } else {
        const itemIndex = state.cartItems.findIndex(
          (item) => item._id === action.payload._id
        );
        if (itemIndex >= 0) {
          state.cartItems[itemIndex].quantity += quantity;
          toast.success("Thêm giỏ hàng thành công");
        } else {
          const tempProduct = { ...action.payload, quantity: quantity };
          state.cartItems.push(tempProduct);
          toast.success("Thêm giỏ hàng thành công");
        }
      }
    },
    //Xóa sản phẩm trong giỏ hàng
    removeFromCart(state, action) {
      const nextCartItems = state.cartItems.filter(
        (cartItem) => cartItem._id !== action.payload.id
      );
      state.cartItems = nextCartItems;
    },
    //Giảm  số lượng
    decreaseCart(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload._id
      );
      if (state.cartItems[itemIndex].quantity > 1) {
        state.cartItems[itemIndex].quantity -= 1;
      } else if (state.cartItems[itemIndex].quantity === 1) {
        const nextCartItems = state.cartItems.filter(
          (cartItem) => cartItem._id !== action.payload._id
        );
        state.cartItems = nextCartItems;
      }
    },

    increaseCart(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload._id
      );

      if (itemIndex >= 0) {
        state.cartItems[itemIndex].quantity += 1;
      }
    },
    clearCart(state, action) {
      state.cartItems = [];
    },
    // getTotals(state, action) {
    //   let { total, quantityTotal } = state.cartItems.reduce(
    //     (cartTotal, cartItem) => {
    //       const { price, quantity } = cartItem;
    //       const itemTotal = price * quantity;

    //       cartTotal.total += itemTotal; // Tổng số tiền tính từ giá của sản phẩm nhân với số lượng
    //       cartTotal.quantityTotal += quantity; // Tổng số lượng sản phẩm trong giỏ hàng

    //       return cartTotal;
    //     },
    //     {
    //       total: 0, // Khởi tạo tổng số tiền là 0
    //       quantityTotal: 0, // Khởi tạo tổng số lượng sản phẩm là 0
    //     }
    //   );

    //   // Khi thực hiện việc tính toán xong, bạn có thể lưu các giá trị đã tính vào state nếu cần thiết.
    //   // Ví dụ:
    //   state.cartTotalAmount = total;
    //   state.cartTotalQuantity = quantityTotal;
    // },
    // Trong hàm Redux getTotals
    getTotals(state, action) {
      let { total, quantityTotal } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, quantity } = cartItem;
          const itemTotal = price * quantity;

          cartTotal.total += itemTotal; // Tổng số tiền tính từ giá của sản phẩm nhân với số lượng
          cartTotal.quantityTotal += quantity; // Tổng số lượng sản phẩm trong giỏ hàng

          return cartTotal;
        },
        {
          total: 0, // Khởi tạo tổng số tiền là 0
          quantityTotal: 0, // Khởi tạo tổng số lượng sản phẩm là 0
        }
      );
      // // Kiểm tra nếu có newTotal được truyền vào từ action
      if (action.payload && action.payload.newTotal !== undefined) {
        total = action.payload.newTotal; // Sử dụng newTotal để cập nhật tổng tiền
        console.log(action.payload.newTotal);
      }

      // Cập nhật lại state.cartTotalAmount với giá trị mới
      state.cartTotalAmount = total;
      state.cartTotalQuantity = quantityTotal;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  decreaseCart,
  increaseCart,
  clearCart,
  getTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
