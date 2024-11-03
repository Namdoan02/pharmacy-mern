import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerUser = async (e) => {
    e.preventDefault();

    // Kiểm tra đầu vào
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ các trường");
      return;
    }
    // Check if email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Địa chỉ email không hợp lệ");
      return;
    }

    // Check if password meets the length requirement
    if (password.length < 6) {
      toast.error("Mật khẩu phải dài ít nhất 6 kí tự");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();
      if (data.exists) {
        toast.error("Email đã tồn tại");
        return;
      }
      if (data.success) {
        toast.success("Đăng ký thành công!");
        navigate("/login");
      } else {
        toast.error("Đăng ký thất bại");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Có lỗi xảy ra trong quá trình đăng ký");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 w-full">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          Đăng ký
        </h2>
        <form className="space-y-6" onSubmit={registerUser}>
          <div>
            <label className="block text-white mb-2">Tên người dùng</label>
            <input
              type="text"
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
              placeholder="Tên người dùng"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <label className="block text-white mb-2">Mật khẩu</label>
            <input
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
          <div className="relative">
            <label className="block text-white mb-2">Nhập lại mật khẩu</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-white top-2/3 transform -translate-y-1/2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <div>
            <button
              type="submit"
              className="w-full p-3 rounded bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none"
            >
              Đăng ký
            </button>
            <div className="text-center text-white mt-4">
              <p>
                Bạn đã có tài khoản?{" "}
                <Link to="/login" className="text-purple-500 hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
