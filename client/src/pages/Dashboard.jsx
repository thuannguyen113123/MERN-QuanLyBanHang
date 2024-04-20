import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashAdminOrders from "../components/DashAdminOrder";
import DashboardComp from "../components/DashboardComp";
import DashCategory from "../components/DashCategory";
import DashComments from "../components/DashComments";
import DashOrders from "../components/DashOrders";
import DashProduct from "../components/DashProduct";
import DashProfile from "../components/DashProfile";
import DashPromotion from "../components/DashPromotion";
import DashSidebar from "../components/DashSidebar";
import DashStatistical from "../components/DashStatistical";
import DashUser from "../components/DashUser";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  //khi thay đổi trên thanh địa chỉ url sẽ render lại
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Thanh sidebar */}
      <div className="">
        <DashSidebar />
      </div>
      {/* Profile */}
      {tab === "profile" && <DashProfile />}
      {/* Danh mục */}
      {tab === "categories" && <DashCategory />}
      {/* sản phẩm */}
      {tab === "products" && <DashProduct />}
      {/* Người dùng */}
      {tab === "users" && <DashUser />}
      {/* Đơn hàng người dùng */}
      {tab === "ordersUser" && <DashOrders />}
      {/* Danh sách đơn hàng  */}
      {tab === "ordersAdmin" && <DashAdminOrders />}
      {/* Bình luận */}
      {tab === "comments" && <DashComments />}
      {/* Trang chủ admin */}
      {tab === "dash" && <DashboardComp />}
      {/* Thống kê */}
      {tab === "statistical" && <DashStatistical />}
      {/* Khuyến mãi */}
      {tab === "promotion" && <DashPromotion />}
    </div>
  );
};

export default Dashboard;
