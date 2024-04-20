import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./configs/db.js";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRotue.js";
import commentRoutes from "./routes/commentRoute.js";
import promotionRoutes from "./routes/promotionRoute.js";

// import path from "path";
// import { fileURLToPath } from "url";

//Cấu hình env(môi trường)
dotenv.config();

const app = express();

// //Kết nối cơ sở dữ liệu
connectDB();

app.use(cors());

app.use(express.json());
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, "../client/build")));

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

//xứ lý đăng nhập
app.use("/api/auth", authRoutes);
//Nguoi72 dung
app.use("/api/user", userRoutes);

//Danh mục
app.use("/api/category", categoryRoutes);

//Sản phẩm
app.use("/api/product", productRoutes);

//Bình luận
app.use("/api/comment", commentRoutes);

//Khuyến mãi
app.use("/api/promotion", promotionRoutes);

// app.use("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"));
// });

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server chạy trên port ${PORT}`);
});
