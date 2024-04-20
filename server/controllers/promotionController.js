import promotionModel from "../models/promotion.model.js";
//Phần khuyến mãi
export const createPromotionController = async (req, res) => {
  try {
    if (
      req.user.id !== req.params.userId &&
      req.user._id !== req.params.userId &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .send({ error: "Không được phép tạo mã khuyến mãi" });
    }
    const newPromotion = await promotionModel.create(req.body);
    res.status(201).send({
      success: true,
      newPromotion,
      message: "Tạo thành công khuyến mãi sản phẩm",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Lỗi khi tạo khuyến mãi sản phẩm",
    });
  }
};
//Lấy mã khuyến mãi
export const getAllPromotion = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit);

    let query = {};
    // Tạo một truy vấn MongoDB với các điều kiện tìm kiếm đã xây dựng
    const promotionsQuery = promotionModel.find(query);
    if (limit) {
      // Nếu limit được truyền vào
      promotionsQuery.limit(limit); // Áp dụng limit nếu có
    }

    // Sử dụng skip() ở đây
    const promotions = await promotionsQuery.skip(startIndex).exec();

    res.status(201).send({
      success: true,
      promotions,
      message: "Lấy danh sách khuyến mãi thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Lỗi khi tạo khuyến mãi sản phẩm",
    });
  }
};
//Xóa mã khuyến mãi

//Xóa sản phẩm
export const deletePromotionController = async (req, res) => {
  try {
    if (
      req.user.id !== req.params.userId &&
      req.user._id !== req.params.userId &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .send({ error: "Không được phép xóa mã khuyến mãi" });
    }
    await promotionModel.findByIdAndDelete(req.params.pId);
    res.status(200).send({
      success: true,
      message: "Mã khuyến mãi xóa thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi khi xóa mã khuyến mãi",
      error,
    });
  }
};
