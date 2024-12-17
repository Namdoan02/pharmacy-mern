// src/components/AddCustomerForm.js
import { useState } from "react";
import { toast } from "react-toastify";

function AddCustomerForm({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    birthDate: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation cơ bản
    if (
      !formData.name ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.gender ||
      !formData.birthDate ||
      !formData.address
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/customers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Không thể tạo khách hàng.");
        return;
      }

      const data = await response.json();
      toast.success("Thêm khách hàng thành công!");
      onSave(data.customer);
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("Đã xảy ra lỗi khi tạo khách hàng.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-black">Thêm Khách Hàng</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        {/* Tên khách hàng */}
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-600">
            Tên Khách Hàng
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Nhập tên khách hàng"
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Nhập email"
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Số điện thoại */}
        <div className="space-y-1">
          <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-600">
            Số Điện Thoại
          </label>
          <input
            type="tel"
            name="phoneNumber"
            id="phoneNumber"
            placeholder="Nhập số điện thoại"
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        {/* Giới tính */}
        <div className="space-y-1">
          <select
            name="gender"
            id="gender"
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        {/* Ngày sinh */}
        <div className="space-y-1 ">
          <label htmlFor="birthDate" className="text-sm font-medium text-gray-600">
            Ngày Sinh
          </label>
          <input
            type="date"
            name="birthDate"
            id="birthDate"
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Địa chỉ */}
        <div className="space-y-1 ">
          <label htmlFor="address" className="text-sm font-medium text-gray-600">
            Địa Chỉ
          </label>
          <textarea
            name="address"
            id="address"
            placeholder="Nhập địa chỉ"
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Nút Gửi và Hủy */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Thêm Khách Hàng
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCustomerForm;
