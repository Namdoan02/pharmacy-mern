import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddSupplierForm = ({ onClose }) => {
  const [supplierName, setSupplierName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const validatePhoneNumber = (phone) => /^\d{10}$/.test(phone);

  const checkEmailUniqueness = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/suppliers/check-email?email=${email}`
      );
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("Số điện thoại phải là 10 chữ số!");
      return;
    }

    const newSupplier = {
      supplierName,
      contactPerson,
      taxCode,
      email,
      phoneNumber,
      address,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/suppliers/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSupplier),
        }
      );

      if (response.ok) {
        toast.success("Nhà cung cấp mới đã được thêm thành công!");
        navigate("/supplier");
        onClose();
      } else {
        toast.error("Không thể thêm nhà cung cấp.");
      }
    } catch (error) {
      console.error("Error adding supplier:", error);
      toast.error("Có lỗi xảy ra khi thêm nhà cung cấp.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white text-gray-900 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Thêm Nhà Cung Cấp</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            Tên nhà cung cấp
          </label>
          <input
            type="text"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
            placeholder="Nhập tên nhà cung cấp"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            Người liên hệ
          </label>
          <input
            type="text"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
            placeholder="Nhập tên người liên hệ"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Mã số thuế</label>
            <input
              type="text"
              value={taxCode}
              onChange={(e) => setTaxCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
              placeholder="Nhập mã số thuế"
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
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            Số điện thoại
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Địa chỉ</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
            placeholder="Nhập địa chỉ"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-600"
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

export default AddSupplierForm;
