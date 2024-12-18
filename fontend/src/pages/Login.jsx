import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Nếu bạn sử dụng react-hot-toast để thông báo
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // Thêm trạng thái email
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của form

    // Kiểm tra xem các trường bắt buộc đã được điền chưa
    if (!email || !password) {
      toast.error("Vui lòng điền đầy đủ các trường");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Đăng nhập thành công!");
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        navigate("/");
      } else {
        toast.error(data.msg || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Có lỗi xảy ra trong quá trình đăng nhập");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700">
      {/* Login Card */}
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-3xl">
        {/* Left Section - Image */}
        <div
          className="hidden md:block md:w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url('https://idodesign.vn/wp-content/uploads/2023/08/mau-thiet-ke-logo-nha-thuoc-dep-1.jpg')",
          }}
        ></div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
            Chào Mừng Bạn!
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Đăng nhập vào hệ thống để tiếp tục
          </p>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Tài Khoản
              </label>
              <input
                type="email"
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-2">
                Mật Khẩu
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 mt-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              Đăng Nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
