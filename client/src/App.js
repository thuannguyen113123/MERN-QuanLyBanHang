import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Header from "./components/Header";
import About from "./pages/About";
import FooterCom from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute.jsx";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreateProduct from "./pages/CreateProduct";
import UpdateProduct from "./pages/UpdateProduct";
import ProductDetail from "./pages/ProductDetail";
import ScrollToTop from "./components/ScrollToTop";
import CategoryProduct from "./pages/CategoryProduct";
import SizeProduct from "./pages/SizeProduct";
import Cart from "./pages/Cart";
// import Orders from "./components/user/Orders";
import Search from "./pages/Search";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreatePromotion from "./pages/CreatePromotion";
import Pagenotfound from "./pages/Pagenotfound";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/user/orders" element={<Orders />} /> */}
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/update-product/:pId" element={<UpdateProduct />} />
          <Route path="/size-product/:pId" element={<SizeProduct />} />
          <Route path="/create-promotion" element={<CreatePromotion />} />
        </Route>
        <Route path="/product/:pSlug" element={<ProductDetail />} />
        <Route path="/category/:pSlug" element={<CategoryProduct />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/*" element={<Pagenotfound />} />
      </Routes>
      <FooterCom />
    </BrowserRouter>
  );
}

export default App;
