import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiAnnotation,
  HiOutlineUserGroup,
  HiOutlineShoppingCart,
  HiOutlineFolder,
  HiChartPie,
} from "react-icons/hi";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlide";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FiShoppingBag } from "react-icons/fi";
import { IoMdAnalytics } from "react-icons/io";
import { FaPercent } from "react-icons/fa";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

  //khi thay đổi trên thanh địa chỉ url sẽ render lại
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  //Đăng xuất
  const handleSignOut = async () => {
    try {
      const res = await axios.post("/api/user/signout");
      const data = await res.data;
      if (!data.success) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2">
          {currentUser && currentUser.user.isAdmin ? (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={HiChartPie}
                as="div"
              >
                Trang chủ
              </Sidebar.Item>
            </Link>
          ) : (
            <Link to="/dashboard?tab=ordersUser">
              <Sidebar.Item
                active={tab === "ordersUser"}
                icon={FiShoppingBag}
                as="div"
              >
                Đơn hàng
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser?.user.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Thông tin cá nhân
            </Sidebar.Item>
          </Link>

          {currentUser?.user.isAdmin && (
            <>
              <Link to="/dashboard?tab=categories">
                <Sidebar.Item
                  active={tab === "categories"}
                  icon={HiOutlineFolder}
                  labelColor="dark"
                  as="div"
                >
                  Danh mục
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=products">
                <Sidebar.Item
                  active={tab === "products"}
                  icon={HiOutlineShoppingCart}
                  labelColor="dark"
                  as="div"
                >
                  Sản phẩm
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  labelColor="dark"
                  as="div"
                >
                  Người dùng
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  labelColor="dark"
                  as="div"
                >
                  Bình Luận
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=ordersAdmin">
                <Sidebar.Item
                  active={tab === "ordersAdmin"}
                  icon={FiShoppingBag}
                  as="div"
                >
                  Đơn hàng
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=promotion">
                <Sidebar.Item
                  active={tab === "promotion"}
                  icon={FaPercent}
                  as="div"
                >
                  Khuyến mãi
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=statistical">
                <Sidebar.Item
                  active={tab === "statistical"}
                  icon={IoMdAnalytics}
                  as="div"
                >
                  Thống kê
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Sidebar.Item
            onClick={handleSignOut}
            icon={HiArrowSmRight}
            className="cursor-pointer"
          >
            Đăng xuất
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
