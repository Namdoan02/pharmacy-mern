import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditUser = ({ userId, onClose, onSave }) => {

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState(""); // Optional for password update

  // Fetch the user's data by ID
  useEffect(() => {
    if (!userId) {
      console.error("No userId provided to EditUser component");
      toast.error("No user ID provided");
      return;
    }
  
    const fetchUserById = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/users/${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user data for ID: ${userId}`);
        }
        const userData = await response.json();
        console.log("Fetched User Data:", userData);
        setName(userData.name || "");
        setRole(userData.role || "");
        setEmail(userData.email || "");
        setPhone(userData.phone || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      }
    };
  
    fetchUserById();
  }, [userId]);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (!validatePhoneNumber(phone)) {
      toast.error("Số điện thoại phải là 10 chữ số!");
      return;
    }

    // Prepare updated user data
    const updatedUser = {  _id: userId,name, role, email, phone };
    if (password){updatedUser.password = password;}  // Include password if it’s updated

    try {
      const response = await fetch(`http://localhost:5000/api/users/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        onSave(updatedUser); // Notify parent to refresh the user list
        onClose(); // Close the modal
      } else {
        toast.error("Không thể cập nhật nhân viên.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật nhân viên.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-200 text-gray-900 rounded-lg shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">Cập nhật thông tin nhân viên</h2>
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
          placeholder="Nhập tên nhân viên"
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
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Mật khẩu (nếu đổi)</label>
          <input
            type="password" autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
            placeholder="Nhập mật khẩu"
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
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
