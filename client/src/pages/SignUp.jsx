import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import OAuth from "../components/OAuth";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // hàm xử lý khi nhấn đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !phone.trim() ||
      !address.trim()
    ) {
      return setErrorMessage("Vui lòng nhập tất cả các trường");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await axios.post(`/api/auth/register`, {
        name,
        email,
        password,
        phone,
        address,
      });

      const data = res.data;
      if (!data.success) {
        return setErrorMessage(data.message);
      }
      navigate("/sign-in");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
      setLoading(false);
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
              <Label value="Tên người dùng" />
              <TextInput
                type="text"
                placeholder="Tên người dùng"
                id="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                placeholder="Tên người dùng"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <Label value="Địa chỉ" />
              <TextInput
                type="text"
                placeholder="Nhập địa chỉ"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <Label value="Số điện thoại" />
              <TextInput
                type="number"
                placeholder="Nhập số điện thoại"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                "Đăng ký"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Bạn đã có tài khoản? </span>
            <Link to="/sign-in" className="text-blue-500">
              Đăng nhập
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

export default SignUp;
