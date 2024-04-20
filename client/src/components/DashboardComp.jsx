import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiOutlineUserGroup,
  HiOutlineShoppingCart,
} from "react-icons/hi";
import { FiShoppingBag } from "react-icons/fi";
import axios from "axios";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

const DashboardComp = () => {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthProducts, setLastMonthProducts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [lastMonthOrders, setLastMonthOrders] = useState(0);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get("/api/user/getusers?limit=5");
        const data = res.data;

        if (data.success) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    //Lấy sản phẩm
    const getProducts = async () => {
      try {
        const res = await axios.get("/api/product/get-product?limit=5");
        const data = res.data;
        if (data.success) {
          setProducts(data.products);
          setTotalProducts(data.countTotal);
          setLastMonthProducts(data.lastMonthProducts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    //Lấy bình luận
    const getComments = async () => {
      try {
        const res = await axios.get("/api/comment/getcomments?limit=5");
        const data = res.data;
        if (data.success) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    //Lấy đơn hàng
    const getOrders = async () => {
      try {
        const res = await axios.get("/api/auth/all-orders?limit=5");
        const data = res.data;
        if (data.success) {
          setOrders(data.orders);
          setTotalOrders(data.countTotal);
          setLastMonthOrders(data.lastMonthOrders);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.user.isAdmin) {
      getUsers();
      getProducts();
      getComments();
      getOrders();
    }
  }, [currentUser.user]);

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Tổng người dùng
              </h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Trong tháng trước</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Tổng bình luận
              </h3>
              <p className="text-2xl">{totalComments}</p>
            </div>
            <HiAnnotation className="bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500">Trong tháng trước</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Tổng sản phẩm</h3>
              <p className="text-2xl">{totalProducts}</p>
            </div>
            <HiOutlineShoppingCart className="bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthProducts}
            </span>
            <div className="text-gray-500">Trong tháng trước</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Tổng đơn hàng</h3>
              <p className="text-2xl">{totalOrders}</p>
            </div>
            <FiShoppingBag className="bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthOrders}
            </span>
            <div className="text-gray-500">Trong tháng trước</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Các người dùng gần nhất</h1>
            <Button color="blue">
              <Link to={"/dashboard?tab=users"}>Hiển thị thêm</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Ảnh đại diện</Table.HeadCell>
              <Table.HeadCell>Tên người dùng</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Các bình luận gần nhất</h1>
            <Button color="blue">
              <Link to={"/dashboard?tab=comments"}>Hiển thị thêm</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Nội dung bình luận</Table.HeadCell>
              <Table.HeadCell>Số lượng thích</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <Table.Body key={comment._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="w-96">
                      <p className="line-clamp-2">{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Các đơn hàng gần nhất</h1>
            <Button color="blue">
              <Link to={"/dashboard?tab=ordersAdmin"}>Hiển thị thêm</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Người đặt hàng</Table.HeadCell>
              <Table.HeadCell>Trạng thái đơn hàng</Table.HeadCell>
              <Table.HeadCell>Số lượng sản phẩm</Table.HeadCell>
            </Table.Head>
            {orders &&
              orders.map((order) => (
                <Table.Body key={order._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="w-96">
                      <p className="line-clamp-2">{order.buyer.username}</p>
                    </Table.Cell>
                    <Table.Cell>{order.status}</Table.Cell>
                    <Table.Cell>{order.products.length}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Các sản phẩm gần nhất</h1>
            <Button color="blue">
              <Link to={"/dashboard?tab=posts"}>Hiển thị thêm</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Ảnh sản phẩm</Table.HeadCell>
              <Table.HeadCell>Tên sản phẩm</Table.HeadCell>
              <Table.HeadCell>Danh mục</Table.HeadCell>
            </Table.Head>
            {products &&
              products.map((product) => (
                <Table.Body key={product._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={product.image}
                        alt="user"
                        className="w-14 h-10 rounded-md bg-gray-500 object-cover"
                      />
                    </Table.Cell>
                    <Table.Cell className="w-96">{product.name}</Table.Cell>
                    <Table.Cell className="w-5">
                      {product.category.name}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardComp;
