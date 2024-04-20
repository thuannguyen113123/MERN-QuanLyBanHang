import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const LineChart = ({ orders }) => {
  const [filter, setFilter] = useState("day");
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center text-[26px]">Không có dữ liệu trong ngày</div>
    );
  }

  const calculateOrderRevenue = (order) => {
    if (order.payment && order.payment.success) {
      return parseFloat(order.payment.transaction.amount);
    }
    return 0;
  };

  const calculateTotalRevenue = () => {
    let totalRevenue = 0;
    orders.forEach((order) => {
      totalRevenue += calculateOrderRevenue(order);
    });
    return totalRevenue.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    if (filter === "day") {
      const selectedDateFormatted = new Date(selectedDate)
        .toISOString()
        .split("T")[0];
      const orderDateFormatted = orderDate.toISOString().split("T")[0];
      return orderDateFormatted === selectedDateFormatted;
    } else if (filter === "month") {
      const selectedMonthYear = new Date(selectedDate)
        .toISOString()
        .substring(0, 7);
      const orderMonthYear = orderDate.toISOString().substring(0, 7);
      return orderMonthYear === selectedMonthYear;
    }
  });

  const chartData = {
    labels: filteredOrders.map(
      (order) => `Đơn hàng ${order._id.substring(0, 8)}`
    ),
    datasets: [
      {
        label: "Doanh thu đơn hàng",
        data: filteredOrders.map((order) => calculateOrderRevenue(order)),
        fill: false,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full mb-10">
      <div className="flex justify-center mb-4">
        <select
          className="px-2 py-1 border rounded-md mr-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="day">Ngày</option>
          <option value="month">Tháng</option>
        </select>
        {(filter === "day" || filter === "month") && (
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat={filter === "month" ? "MM/yyyy" : "dd/MM/yyyy"}
            showMonthYearPicker={filter === "month"}
            className="px-2 py-1 border rounded-md"
          />
        )}
      </div>
      <span className="text-center text-[24px]">
        Tổng doanh thu: {calculateTotalRevenue()}
      </span>
      <Line className="dark:bg-white rounded-lg shadow-lg" data={chartData} />
    </div>
  );
};

export default LineChart;
