import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFacebook, BsTiktok, BsGithub } from "react-icons/bs";

const FooterCom = () => {
  return (
    <Footer className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="flex justify-center items-center">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full text-white">
                Thuận's
              </span>
              SHOP
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6 mt-4">
            <div>
              <Footer.Title title="Thông tin" />
              <Footer.LinkGroup col>
                {/* target là mở tab mới còn rel là xác định có liên quan tài nguyên */}
                <Footer.Link href="/" target="_blank" rel="noopeper noreferrer">
                  Web Liên quan
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopeper noreferrer"
                >
                  Thuận's SHOP
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Theo dõi tôi" />
              <Footer.LinkGroup col>
                {/* target là mở tab mới còn rel là xác định có liên quan tài nguyên */}
                <Footer.Link
                  href="https://github.com/thuannguyen113123"
                  target="_blank"
                  rel="noopeper noreferrer"
                >
                  GitHub
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopeper noreferrer"
                >
                  Thuận's SHOP
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Hỗ trợ khách hàng" />
              <Footer.LinkGroup col>
                {/* target là mở tab mới còn rel là xác định có liên quan tài nguyên */}
                <Footer.Link
                  href="/sign-in"
                  target="_blank"
                  rel="noopeper noreferrer"
                >
                  Đăng Ký tài khoản
                </Footer.Link>
                <Footer.Link href="/" target="_blank" rel="noopeper noreferrer">
                  Hướng dẫn thanh toán
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Thuận's SHOP"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsTiktok} />
            <Footer.Icon href="#" icon={BsGithub} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterCom;
