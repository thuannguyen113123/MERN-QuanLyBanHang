import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const BarChart = ({ orders }) => {
  const transformData = () => {
    const statusCounts = {};

    // Đếm số lượng đơn hàng cho mỗi trạng thái
    orders.forEach((order) => {
      if (statusCounts[order.status]) {
        statusCounts[order.status]++;
      } else {
        statusCounts[order.status] = 1;
      }
    });

    // Chuyển đổi dữ liệu thành dạng phù hợp cho biểu đồ
    const transformedData = {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: "Số lượng đơn hàng",
          data: Object.values(statusCounts),
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };

    return transformedData;
  };

  const data = transformData();
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Số lượng trạng thái đơn hàng",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: "400px", height: "400px" }}>
      <Bar
        className="dark:bg-white rounded-lg shadow-lg"
        data={data}
        options={options}
      />
    </div>
  );
};

export default BarChart;
