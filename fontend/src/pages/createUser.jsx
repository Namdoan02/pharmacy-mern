import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const CreateUser = ({ onClose }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("active");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { name, role, email, status, password };

    try {
      const response = await fetch("http://localhost:5000/api/auth/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        toast.success("Người dùng đã được thêm thành công!"); // Success notification
        navigate("/users"); // Redirect to the user list
        onClose(); // Close the form after successful submission
      } else {
        toast.error("Không thể thêm người dùng."); // Error notification
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Có lỗi xảy ra khi thêm người dùng."); // Error notification
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-700 text-gray-100 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Thêm người dùng mới</h2>
        <button
          onClick={onClose} // Close button functionality
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Quyền</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
            required
          >
            <option value="">Chọn quyền</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Trạng thái</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
        >
          Thêm mới
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
