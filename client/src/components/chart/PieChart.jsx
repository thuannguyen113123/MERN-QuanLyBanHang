import React from "react";
import { Doughnut } from "react-chartjs-2";

const ProductPieChart = ({ orders }) => {
  // Tạo một object để đếm số lượng mỗi sản phẩm
  const productCount = {};
  orders.forEach((order) => {
    order.products.forEach((product) => {
      const productId = product._id;
      const productName = product.name;
      if (productCount[productId]) {
        productCount[productId].count += 1;
      } else {
        productCount[productId] = { count: 1, name: productName };
      }
    });
  });

  // Tạo dữ liệu cho biểu đồ tròn
  const data = {
    labels: Object.values(productCount).map((product) => product.name),
    datasets: [
      {
        label: "Tỉ lệ sản phẩm được mua",
        data: Object.values(productCount).map((product) => product.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "400px", height: "400px" }}>
      <Doughnut className="dark:bg-white rounded-lg shadow-lg" data={data} />
    </div>
  );
};

export default ProductPieChart;
