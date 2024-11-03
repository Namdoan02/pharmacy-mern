import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // Nếu bạn sử dụng react-hot-toast để thông báo

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
      const response = await fetch("http://localhost:5000/api/auth/login", {
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
    <div className="h-screen flex items-center justify-center bg-gray-900 w-full">
      {/* Login Form */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-white mb-2">Tài khoản</label>
            <input
              type="email"
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
              placeholder="Email"
              value={email} // Thêm giá trị cho trường email
              onChange={(e) => setEmail(e.target.value)} // Cập nhật giá trị khi thay đổi
            />
          </div>
          <div className="relative">
            <label className="block text-white mb-2">Mật khẩu</label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-white top-2/3 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <div className="flex items-center justify-between text-white">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <span>Lưu mật khẩu</span>
            </label>
            <a href="#" className="text-purple-500 hover:underline">
              Quên mật khẩu?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white p-3 rounded hover:bg-purple-600"
          >
            Đăng nhập
          </button>
          <div className="text-center text-white mt-4">
            <p>
              Bạn chưa có tài khoản?{" "}
              <Link to="/register" className="text-purple-500 hover:underline">
                Tạo tài khoản
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
