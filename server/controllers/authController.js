import userModel from "../models/user.model.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import orderModel from "../models/order.model.js";
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Xử lý các trường hợp người dùng không nhập gì
    if (!name) {
      return res.send({ error: "Tên người dùng là bắt buộc" });
    }
    if (!email) {
      return res.send({ error: "Email là bắt buộc" });
    }
    if (!password) {
      return res.send({ error: "Mật khẩu là bắt buộc" });
    }
    if (!phone) {
      return res.send({ error: "Số điện thoại là bắt buộc" });
    }
    if (!address) {
      return res.send({ error: "Địa chỉ là bắt buộc" });
    }

    // Kiểm tra email của người dùng trong quá trình đăng ký
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Đăng ký không thành công. Email đã tồn tại.",
      });
    }

    const hashedPassword = await hashPassword(password);

    // Lưu lại trong cơ sở dữ liệu
    const user = await new userModel({
      username: name,
      email,
      phone,
      address,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "Đăng ký thành công tài khoản",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi khi đăng ký",
      error,
    });
  }
};
// // Đăng nhập
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Kiểm tra
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Email hoặc mật khẩu không hợp lệ",
      });
    }

    // Kiểm tra email đã được đăng ký chưa
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email chưa được đăng ký",
      });
    }

    // Kiểm tra mật khẩu mã hóa và mật khẩu
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Mật khẩu không hợp lệ",
      });
    }

    // Gắn token khi đăng nhập vào web
    const token = await JWT.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .send({
        success: true,
        message: "Đăng nhập thành công",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          token,
        },
        token,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Lỗi đăng nhập ở login",
      error,
    });
  }
};

// //Xữ lý đăng nhập với gg
export const loginWithGoogleController = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const token = JWT.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;

      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .send({
          success: true,
          message: "Đăng nhập thành công",
          user: rest,
          token,
        });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      const newUser = new userModel({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = JWT.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );

      const { password, ...rest } = newUser._doc;
      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .send({
          success: true,
          message: "Đăng nhập thành công",
          user: rest,
          token,
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Lỗi đăng nhập",
      error: error.message,
    });
  }
};

//Đặt hàng
export const getOrdersController = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10; // Giới hạn mặc định là 10 đơn hàng mỗi lần

    // Thực hiện tìm kiếm đơn hàng dựa trên các tham số truy vấn và ID của người dùng
    const orders = await orderModel
      .find({ buyer: req.user._id }) // Giả sử trường buyer lưu trữ ID của người dùng
      .populate("products")
      .populate("buyer", "username")
      .skip(startIndex)
      .limit(limit);

    // Trả về danh sách đơn hàng
    res.json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Lỗi khi lấy đơn đặt hàng",
      error,
    });
  }
};

// //Tất cả đơn đặt hàng
// export const getAllOrdersController = async (req, res) => {
//   if (!req.user.isAdmin) {
//     return res
//       .status(403)
//       .send({ error: "Không được phép lấy danh sách đơn hàng" });
//   }
//   try {
//     const startIndex = parseInt(req.query.startIndex) || 0;
//     const limit = parseInt(req.query.limit) || 10; // Giới hạn mặc định là 10 đơn hàng mỗi lần
//     const sortDirection = req.query.order === "asc" ? 1 : -1;

//     // Thực hiện tìm kiếm đơn hàng dựa trên các tham số truy vấn
//     const orders = await orderModel
//       .find({})
//       .populate("products")
//       .populate("buyer", "username")
//       .sort({ createdAt: sortDirection })
//       .skip(startIndex)
//       .limit(limit);

//     // Đếm tổng số đơn hàng
//     const totalOrders = await orderModel.countDocuments();

//     // Trả về kết quả và thông tin về số lượng đơn hàng
//     // Tính số lượng sản phẩm được tạo trong tháng trước
//     const now = new Date();
//     const oneMonthAgo = new Date(
//       now.getFullYear(),
//       now.getMonth() - 1,
//       now.getDate()
//     );
//     const lastMonthOrders = await orderModel.countDocuments({
//       createdAt: { $gte: oneMonthAgo },
//     });
//     res.status(200).send({
//       success: true,
//       countTotal: totalOrders,
//       message: "Tất cả đơn hàng",
//       orders,
//       lastMonthOrders,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Xảy ra lỗi khi lấy đơn hàng",
//       error: error.message,
//     });
//   }
// };

export const getAllOrdersController = async (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .send({ error: "Không được phép lấy danh sách đơn hàng" });
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit);
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    let query = {}; // Điều kiện tìm kiếm mặc định là tất cả
    if (req.query.date) {
      let selectedDate = new Date(req.query.date);
      let nextDate = new Date(selectedDate);
      if (req.query.filterType === "month") {
        // Nếu loại lọc là theo tháng, chỉ lấy năm và tháng
        selectedDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1
        );
        nextDate = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 1);
      } else {
        // Nếu loại lọc là theo ngày, lấy cả ngày
        nextDate.setDate(selectedDate.getDate() + 1);
      }
      query = {
        createdAt: {
          $gte: selectedDate,
          $lt: nextDate,
        },
      };
    }

    const ordersQuery = orderModel.find(query); // Sử dụng query khi có điều kiện

    if (limit) {
      // Nếu limit được truyền vào
      ordersQuery.limit(limit); // Áp dụng limit nếu có
    }

    const ordersPromise = ordersQuery
      .populate("products")
      .populate("buyer", "username")
      .sort({ createdAt: sortDirection })
      .skip(startIndex);

    const [orders, totalOrders] = await Promise.all([
      ordersPromise,
      orderModel.countDocuments(query),
    ]);

    res.status(200).send({
      success: true,
      countTotal: totalOrders,
      message: "Tất cả đơn hàng",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Xảy ra lỗi khi lấy đơn hàng",
      error: error.message,
    });
  }
};

//Xữ lý cập nhật đơn hàng
export const orderStatusController = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .send({ error: "Không được phép thay đổi trạng thái đơn hàng" });
    }

    const { orderId } = req.params;
    const { status } = req.body;
    console.log(typeof status);
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi khi cập nhật đơn hàng",
      error,
    });
  }
};
