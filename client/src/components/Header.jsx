import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice.js";
import { signoutSuccess } from "../redux/user/userSlide.js";
import axios from "axios";
import { useNavigate } from "react-router";

const Header = () => {
  //Tạo này để nó acctive vào cái mình chọn trong toggle
  const path = useLocation().pathname;

  //Lấy người dùng hiện tại
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const [listCategory, setListCategory] = useState([]);
  //tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  //Lấy trạng thái theme
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

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
  //Load danh mục
  const getAllCategory = async (req, res) => {
    try {
      const res = await axios.get(`/api/category/get-category`);
      const data = res.data;
      if (data.success) {
        setListCategory(data.category);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getAllCategory();
  }, []);

  const cart = useSelector((state) => state.cart);
  //Tìm kiếm
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="border-b-2">
      {/* co giản cở chử theo kích thước web text-sm sm:text-xl */}
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full text-white">
          Thuận's
        </span>
        SHOP
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Nhập để tìm kiếm..."
          rightIcon={AiOutlineSearch}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          //Ẩn đi khi giao diện web thì hiện dt thì ẩn thanh input
          className="hidden lg:inline-block"
        />
      </form>
      {/* Giao diện web thì ẩn dt thì hiện pill thuộc tín làm nút như viên thuốc*/}
      <Link to="/search">
        <Button className="w-12 h-10 lg:hidden" color="gray" pill>
          <AiOutlineSearch />
        </Button>
      </Link>
      <div className="flex gap-2 md:order-2">
        <Button
          pill
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        <Link to="/cart">
          <Button pill className="w-12 h-10 relative" color="gray">
            {cart?.cartItems?.length > 0 && (
              <>
                <div className="absolute top-[2px] right-[2px] bg-red-500 text-white rounded-full w-[16px] h-[16px] text-[12px] flex items-center justify-center">
                  {cart.cartItems.length}
                </div>
              </>
            )}
            <AiOutlineShoppingCart />
          </Button>
        </Link>
        {currentUser?.user ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={currentUser.user?.profilePicture}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">
                @{currentUser.user?.username}
              </span>
              <span className="block text-sm font-medium truncate">
                {currentUser.user?.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Thông Tin</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Đăng Xuất</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue">Đăng nhập</Button>
          </Link>
        )}
        {/* //Khi mà chuyển sang dt thì sẽ hiên toggle này */}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/home"} as={"div"}>
          <Link to="/">Trang chủ</Link>
        </Navbar.Link>

        <Navbar.Link className="relative group" as={"div"}>
          <div className="hover:opacity-50 cursor-default">Danh mục</div>
          <div className="lg:block sm:hidden bg-white dark:bg-gray-700 absolute top-0 -left-16 transition transform translate-y-0 opacity-0 invisible group-hover:translate-y-5 group-hover:opacity-100 group-hover:visible duration-500 ease-in-out z-50 min-w-[200px]">
            <div className="relative p-6 bg-inherit rounded-xl shadow-xl w-full iner ">
              {listCategory &&
                listCategory.map((category) => (
                  <Link
                    key={category._id}
                    id={category._id}
                    to={`/category/${category.slug}`}
                    className="inline-block w-[100%] text-center text-[14px] py-2 "
                  >
                    {category.name}
                  </Link>
                ))}
            </div>
          </div>
          <div className="sm:block md:hidden">
            {listCategory &&
              listCategory.map((category) => (
                <Link
                  key={category._id}
                  id={category._id}
                  to={`/category/${category.slug}`}
                  className="inline-block w-[100%] text-center text-[14px] py-2 "
                >
                  {category.name}
                </Link>
              ))}
          </div>
        </Navbar.Link>

        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">Giới thiệu</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
