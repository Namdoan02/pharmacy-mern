import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateUser = ({ onClose }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const checkEmailUniqueness = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/check-email?email=${email}`);
      const data = await response.json();
      return data.isUnique; // Server returns { isUnique: true } if email is unique
    } catch (error) {
      console.error("Error checking email uniqueness:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/;
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ!");
      return;
    }
    
    // Check email uniqueness
    const isEmailUnique = await checkEmailUniqueness(email);
    if (!isEmailUnique) {
      toast.error("Email đã tồn tại!");
      return;
    }

    // Validate phone number format
    if (!validatePhoneNumber(phone)) {
      toast.error("Số điện thoại phải là 10 chữ số!");
      return;
    }
    if(password !== confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }
    const newUser = { name, role, email, phone, password };

    try {
      const response = await fetch("http://localhost:5000/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        toast.success("Người dùng đã được thêm thành công!");
        navigate("/users");
        onClose();
      } else {
        toast.error("Không thể thêm người dùng.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Có lỗi xảy ra khi thêm người dùng.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-200 text-gray-900 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Thêm người dùng mới</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Tên tài khoản</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
            placeholder="Nhập tên người dùng"
            autoComplete="name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
            placeholder="Nhập email"
            autoComplete="email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Quyền</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="sale"
                checked={role === "sale"}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              Bán hàng
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              Quản trị
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Số điện thoại</label>
          <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
              placeholder="Nhập số điện thoại"
              autoComplete="tel"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Mật khẩu</label>
            <input
              type="password" autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Xác nhận mật khẩu</label>
            <input
              type="password" autoComplete="off"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
              placeholder="Xác nhận mật khẩu"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  export default CreateUser;
  
