import slugify from "slugify";
import productModel from "../models/product.model.js";
import braintree from "braintree";
import orderModel from "../models/order.model.js";
import dotenv from "dotenv";
import sizeModel from "../models/sizeProduct.model.js";
import promotionModel from "../models/promotion.model.js";

dotenv.config();

//Cổng thanh toán
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
//Tạo sản phẩm
export const createProductController = async (req, res) => {
  try {
    if (
      req.user.id !== req.params.userId &&
      req.user._id !== req.params.userId &&
      !req.user.isAdmin
    ) {
      return res.status(403).send({ error: "Không được phép tạo sản phẩm" });
    }
    switch (true) {
      case !req.body.name:
        return res.status(500).send({ error: "Tên sản phẩm là bắt buộc" });
      case !req.body.description:
        return res.status(500).send({ error: "Mô tả là bắt buộc" });
      case !req.body.price:
        return res.status(500).send({ error: "Giá là bắt buộc" });
      case !req.body.category:
        return res.status(500).send({ error: "Danh mục là bắt buộc" });
    }

    const products = new productModel({
      ...req.body,
      slug: slugify(req.body.name),
    });

    await products.save();
    // Xử lý thông tin kích thước nếu có
    if (req.body.size && req.body.quantityForSize) {
      const sizeData = {
        product: products._id,
        size: req.body.size,
        quantity: req.body.quantityForSize,
      };

      // Lưu thông tin kích thước vào cơ sở dữ liệu
      const size = new sizeModel(sizeData);
      await size.save();
    }

    res.status(201).send({
      success: true,
      products,
      message: "Tạo thành công sản phẩm",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Lỗi khi tạo sản phẩm",
    });
  }
};

// Lấy tất cả sản phẩm
// export const getProductController = async (req, res) => {
//   try {
//     const startIndex = parseInt(req.query.startIndex) || 0;
//     const limit = parseInt(req.query.limit) || 12;

//     const sortDirection = req.query.order === "asc" ? 1 : -1;
//     const sortBy =
//       req.query.sortBy === "sold" ? { sold: -1 } : { createdAt: sortDirection };

//     // Thực hiện tìm kiếm sản phẩm dựa trên các tham số truy vấn
//     const products = await productModel
//       .find({
//         ...(req.query.category && { category: req.query.category }),
//         ...(req.query.pSlug && { slug: req.query.pSlug }),
//         ...(req.query.pId && { _id: req.query.pId }),
//         ...(req.query.searchTerm && {
//           $or: [
//             { name: { $regex: req.query.searchTerm, $options: "i" } },
//             { description: { $regex: req.query.searchTerm, $options: "i" } },
//           ],
//         }),
//       })
//       .populate("category")
//       .limit(limit)
//       .sort(sortBy)
//       .skip(startIndex);

//     // Đếm tổng số sản phẩm
//     const totalProducts = await productModel.countDocuments();

//     // Tính số lượng sản phẩm được tạo trong tháng trước
//     const now = new Date();
//     const oneMonthAgo = new Date(
//       now.getFullYear(),
//       now.getMonth() - 1,
//       now.getDate()
//     );
//     const lastMonthProducts = await productModel.countDocuments({
//       createdAt: { $gte: oneMonthAgo },
//     });

//     // Trả về kết quả và thông tin về số lượng sản phẩm được tạo trong tháng trước
//     res.status(200).send({
//       success: true,
//       countTotal: totalProducts,
//       message: "Tất cả sản phẩm",
//       products,
//       lastMonthProducts,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Xảy ra lỗi khi lấy sản phẩm",
//       error: error.message,
//     });
//   }
// };
export const getProductController = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit);

    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const sortBy =
      req.query.sortBy === "sold" ? { sold: -1 } : { createdAt: sortDirection };

    // Xây dựng các điều kiện tìm kiếm từ các tham số truy vấn
    const query = {
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.pSlug && { slug: req.query.pSlug }),
      ...(req.query.pId && { _id: req.query.pId }),
      ...(req.query.searchTerm && {
        $or: [
          { name: { $regex: req.query.searchTerm, $options: "i" } },
          { description: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };

    // Tạo một truy vấn MongoDB với các điều kiện tìm kiếm đã xây dựng
    const productsQuery = productModel.find(query);

    if (limit) {
      // Nếu limit được truyền vào
      productsQuery.limit(limit); // Áp dụng limit nếu có
    }

    // Thực hiện truy vấn MongoDB và lấy danh sách sản phẩm
    const products = await productsQuery
      .populate("category")
      .sort(sortBy)
      .skip(startIndex);

    // Đếm tổng số sản phẩm
    const totalProducts = await productModel.countDocuments();

    // Tính số lượng sản phẩm được tạo trong tháng trước
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthProducts = await productModel.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Trả về kết quả và thông tin về số lượng sản phẩm được tạo trong tháng trước
    res.status(200).send({
      success: true,
      countTotal: totalProducts,
      message: "Tất cả sản phẩm",
      products,
      lastMonthProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Xảy ra lỗi khi lấy sản phẩm",
      error: error.message,
    });
  }
};

//Xóa sản phẩm
export const deleteProductController = async (req, res) => {
  try {
    if (
      req.user.id !== req.params.userId &&
      req.user._id !== req.params.userId &&
      !req.user.isAdmin
    ) {
      return res.status(403).send({ error: "Không được phép xóa sản phẩm" });
    }
    await productModel.findByIdAndDelete(req.params.pId);
    res.status(200).send({
      success: true,
      message: "sản phẩm xóa thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi khi xóa",
      error,
    });
  }
};

//Cập nhật sản phẩm
export const updateProductController = async (req, res) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.pId,
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          category: req.body.category,
          image: req.body.image,
          price: req.body.price,
          slug: slugify(req.body.name),
        },
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Cập nhật thành công",
      products: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi cập nhật",
    });
  }
};
//Size sản phẩm
export const getSizeProductController = async (req, res) => {
  try {
    const sizeProduct = await sizeModel.find({ product: req.params.pId });

    res.status(200).send({
      success: true,
      message: "Tất cả size sản phẩm",
      sizeProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi khi lấy size",
    });
  }
};
//Xóa size sản phẩm
export const deleteSizeProductController = async (req, res) => {
  try {
    if (
      req.user.id !== req.params.userId &&
      req.user._id !== req.params.userId &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .send({ error: "Không được phép xóa size sản phẩm" });
    }
    await sizeModel.findByIdAndDelete(req.params.pId);
    res.status(200).send({
      success: true,
      message: "size sản phẩm xóa thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi khi xóa",
      error,
    });
  }
};
//Thêm size sản phẩm
export const createSizeProductController = async (req, res) => {
  try {
    if (
      req.user.id !== req.params.userId &&
      req.user._id !== req.params.userId &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .send({ error: "Không được phép thêm  size sản phẩm" });
    }
    if (req.body.size) {
      // Tìm sản phẩm có productId tương ứng
      const existingProduct = await sizeModel.findOne({
        product: req.body.productId,
      });

      if (existingProduct) {
        // Kiểm tra xem kích thước đã tồn tại trong sản phẩm hay chưa
        if (existingProduct.size === req.body.size) {
          return res
            .status(403)
            .send({ success: false, error: "size sản phẩm đã có" });
        }
      }
    }

    const newSize = new sizeModel({
      product: req.body.productId,
      size: req.body.size,
      quantity: req.body.quantity,
    });
    await newSize.save();
    res.status(200).send({
      success: true,
      message: "Tạo size thành công",
      newSize,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi khi thêm size sản phẩm",
      error,
    });
  }
};

//Cập nhật size
export const updateSizeProductController = async (req, res) => {
  try {
    if (
      req.user.id !== req.params.userId &&
      req.user._id !== req.params.userId &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .send({ error: "Bạn không được phép cập nhật size sản phẩm" });
    }

    const { size, quantity } = req.body;
    if (!size || !quantity) {
      return res.status(400).send({
        success: false,
        error: "Size hoặc số lượng không được để trống",
      });
    }

    const updatedSizeProduct = await sizeModel.findByIdAndUpdate(
      req.params.sizeId,
      { product: req.body.productId, size, quantity },
      { new: true }
    );

    if (!updatedSizeProduct) {
      return res.status(404).send({
        success: false,
        error: "Không tìm thấy size sản phẩm để cập nhật",
      });
    }

    res.status(200).send({
      success: true,
      message: "Cập nhật size sản phẩm thành công",
      updatedSizeProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi khi cập nhật size sản phẩm",
      error,
    });
  }
};

//api cổng thanh toán
export const braintreeTokenController = async (req, res) => {
  try {
    //token từ braintree
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
//Thanh toán

export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart, total, listPromotion } = req.body;

    let orderDetails = [];
    let errorMessage = ""; // Biến lưu thông điệp lỗi

    for (const item of cart) {
      const product = await productModel.findById(item._id);
      const size = await sizeModel
        .findOne({ product: item._id, size: item.size })
        .select("quantity");

      if (!product || !size || size.quantity < item.quantity) {
        console.log(item.quantity, size ? size.quantity : "unknown");
        errorMessage = "Số lượng sản phẩm trong kho không đủ"; // Lưu thông điệp lỗi
        break;
      } else {
        const remainingQuantity = size.quantity - item.quantity;
        await sizeModel.findOneAndUpdate(
          { _id: size._id },
          { quantity: remainingQuantity },
          { new: true }
        );
      }
      orderDetails.push({
        size: item.size,
        quantity: item.quantity,
        total: total,
      });
    }

    if (errorMessage) {
      return res.status(200).send({ success: false, message: errorMessage });
    }

    for (const promotionItem of listPromotion) {
      // Kiểm tra xem sản phẩm có áp dụng mã giảm giá không
      if (promotionItem._id) {
        // Đổi tên biến thành promotionItem
        const promotion = await promotionModel.findOneAndUpdate(
          {
            _id: promotionItem._id,
            codePromotion: promotionItem.codePromotion, // Sử dụng mã giảm giá từ sản phẩm
            endDate: { $gte: new Date() }, // Kiểm tra xem mã giảm giá còn hiệu lực không
            isActive: true, // Kiểm tra xem mã giảm giá có đang hoạt động không
            quantityPromotion: { $gt: 0 }, // Kiểm tra số lượng mã giảm giá còn lại
          },
          { $inc: { quantityPromotion: -1 } }, // Giảm số lượng mã giảm giá đi 1
          { new: true }
        );

        if (!promotion) {
          // Nếu không tìm thấy mã giảm giá hoặc đã hết hạn, thông báo cho người dùng
          return res.status(200).send({
            success: false,
            message: "Mã giảm giá không hợp lệ hoặc đã hết hiệu lực",
          });
        }

        if (promotion.quantityPromotion === 0) {
          // Nếu quantityPromotion bằng 0, mã giảm giá đã hết hiệu lực
          await promotionModel.findOneAndUpdate(
            { _id: promotionItem._id },
            { isActive: false } // Chuyển trạng thái của mã giảm giá sang không hoạt động
          );
          return res
            .status(200)
            .send({ success: false, message: "Mã giảm giá đã hết hiệu lực" });
        }

        if (promotion.endDate < new Date()) {
          // Nếu ngày kết thúc của mã giảm giá đã vượt qua thời gian hiện tại
          await promotionModel.findOneAndUpdate(
            { _id: promotionItem._id },
            { isActive: false } // Chuyển trạng thái của mã giảm giá sang không hoạt động
          );
          return res
            .status(200)
            .send({ success: false, message: "Mã giảm giá đã hết hiệu lực" });
        }
      }
    }

    // Tiếp tục xử lý giao dịch thanh toán nếu không có lỗi về số lượng
    gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id || req.user.id,
            infoDetail: orderDetails,
          }).save();
          return res
            .status(200)
            .send({ success: true, message: "Thanh toán thành công" });
        } else {
          return res
            .status(500)
            .send({ success: false, message: "Lỗi thanh toán", error });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send("Lỗi server");
  }
};
