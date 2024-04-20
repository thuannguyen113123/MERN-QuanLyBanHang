import userModel from "../models/user.model.js";
import { hashPassword } from "./../helpers/authHelper.js";
import { errorHandler } from "../utils/error.js";

export const updateUserController = async (req, res, next) => {
  if (req.user.id !== req.params.userId && req.user._id !== req.params.userId) {
    return next(
      errorHandler(403, "Bạn không được phép cập nhật người dùng này")
    );
  }

  try {
    let updatedFields = {
      username: req.body.username,
      email: req.body.email,
      profilePicture: req.body.profilePicture,
    };

    // Nếu người dùng đã có thông tin address và phone
    if (req.body.address && req.body.phone) {
      updatedFields.address = req.body.address;
      updatedFields.phone = req.body.phone;
    } else {
      // Nếu không có thông tin address và phone, kiểm tra nếu đã có sẵn trong database và cập nhật lại
      const existingUser = await userModel.findById(req.params.userId);
      if (existingUser.address && existingUser.phone) {
        updatedFields.address = existingUser.address;
        updatedFields.phone = existingUser.phone;
      }
    }

    // Thực hiện cập nhật hoặc thêm mới thông tin
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: req.params.userId },
      {
        $set: {
          ...updatedFields,
          password: req.body.password
            ? await hashPassword(req.body.password)
            : undefined, // Chỉ mã hóa mật khẩu nếu mật khẩu được cung cấp
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).send({
      success: true,
      message: "Cập nhật thành công",
      user: rest,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Lỗi cập nhật",
      error,
    });
  }
};

//Người dùng tự xóa tài khoản
export const deleteUserController = async (req, res, next) => {
  if (
    !req.user.isAdmin &&
    req.user.id !== req.params.userId &&
    req.user._id !== req.params.userId
  ) {
    return next(errorHandler(403, "Bạn không được phép xóa người dùng này"));
  }
  try {
    await userModel.findByIdAndDelete(req.params.userId);
    res.status(200).send({
      success: true,
      message: "Xóa tài khoản thành công",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Lỗi xóa tài khoản",
      error,
    });
  }
};

export const signOutController = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .send({ success: true, message: "đăng xuất thành công" });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Lỗi đăng xuất",
      error,
    });
  }
};

//Lấy danh sách người dùng
export const getUsersController = async (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .send({ error: "Không được phép lấy danh sách người dùng" });
  }
  try {
    const startIndex = parseInt(req.query.startIndex || 0);
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1; // Nếu là "asc" thì sortDirection = 1, ngược lại thì -1

    const users = await userModel
      .find()
      .sort({ createdAt: sortDirection }) // Sửa createAt thành createdAt
      .skip(startIndex)
      .limit(limit);

    // Lấy tất cả người dùng bỏ password ra
    const userWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest; // Trả về object chỉ chứa các trường không phải là password
    });

    // Đếm tổng cộng có bao nhiêu user
    const totalUsers = await userModel.countDocuments();

    // Lấy 1 tháng gần nhất
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await userModel.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).send({
      success: true,
      message: "Lấy thành công danh sách người dùng",
      users: userWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi khi lấy danh sách người dùng",
    });
  }
};
//Lấy 1 người dùng
export const getUserController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }
    const { password, ...rest } = user._doc;
    res.status(200).send({
      success: true,
      message: "Lấy thông tin người dùng thành công",
      user: rest,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Lỗi lấy thông tin người dùng",
      error,
    });
  }
};
