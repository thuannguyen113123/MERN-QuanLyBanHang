import React, { useEffect, useState } from "react";
import axios from "axios";
import BarChart from "./chart/BarChart";
import PieChart from "./chart/PieChart";
import LineChart from "./chart/LineChart";

const DashStatistical = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy tất cả đơn hàng
  const getOrders = async () => {
    try {
      const { data } = await axios.get(`/api/auth/all-orders`);
      setOrders(data.orders);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="p-3 md:mx-auto">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="max-w-6xl mx-auto w-full">
            <LineChart orders={orders} />
          </div>
          <div className="flex-wrap flex gap-4 justify-between w-full h-full">
            <BarChart orders={orders} />
            <PieChart orders={orders} />
          </div>
        </>
      )}
    </div>
  );
};

export default DashStatistical;
