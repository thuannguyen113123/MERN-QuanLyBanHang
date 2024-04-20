import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlide.js";
import OAuth from "../components/OAuth.jsx";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();

  const { loading, error: errorMessage } = useSelector((state) => state.user);

  // hàm xử lý khi nhấn đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      return dispatch(signInFailure("Vui lòng không để trống"));
    }
    try {
      dispatch(signInStart());
      const res = await axios.post(`/api/auth/login`, {
        email,
        password,
      });

      const data = res.data;
      if (!data.success) {
        dispatch(signInFailure(data.message));
      }
      if (data.success) {
        dispatch(signInSuccess(data));

        navigate(location.state || "/");
      }
    } catch (error) {
      console.log(error);
      dispatch(signInFailure(error.message));
    }
  };

  return (
    //min-h-screen sẽ đặt chiều cao tối thiểu của phần tử đó là bằng chiều cao của màn hình
    <div className="min-h-screen mt-20">
      {/* //mx-auto căn giữa phần tử theo chiều ngang */}
      {/* Khi màng hình trung bình thì sẽ flex-row */}
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Phần bên trái */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full text-white">
              Thuận's
            </span>
            SHOP
          </Link>
          <p className="text-sm mt-5">
            Đây là nơi có thể lựa chọn sản phẩm tốt. Bạn có thể đăng ký tài
            khoản bằng email và mật khẩu hoặc có thể đăng nhập bằng tài khoản
            Google.
          </p>
        </div>
        {/* Phần bên phải */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label value="Mật Khẩu" />
              <TextInput
                type="password"
                placeholder="**********"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              gradientDuoTone="purpleToBlue"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" /> <span>Đang tải....</span>
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Bạn chưa có tài khoản? </span>
            <Link to="/sign-up" className="text-blue-500">
              Đăng ký
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
