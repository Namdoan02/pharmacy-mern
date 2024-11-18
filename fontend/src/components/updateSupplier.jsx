import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditSupplier = ({ supplierId, onClose, onSave }) => {
  const [supplierName, setSupplierName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [invoiceSymbol, setInvoiceSymbol] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  // Fetch the supplier's data by ID
  useEffect(() => {
    if (!supplierId) {
      console.error("No supplierId provided to EditUser component");
      toast.error("No supplier ID provided");
      return;
    }
    const fetchSupplierById = async () => {
      try{
        const response = await fetch(
          `http://localhost:5000/api/suppliers/suppliers/${supplierId}`
        );
        if (!response.ok) {
          
          throw new Error(
            `Failed to fetch supplier data: ${supplierId}`
          );
        }

        const supplierData = await response.json();
        console.log("Fetched Supplier Data:", supplierData);

        // Update state with the fetched data
        setSupplierName(supplierData.data.supplierName || "");
        setContactPerson(supplierData.data.contactPerson || "");
        setTaxCode(supplierData.data.taxCode || "");
        setInvoiceSymbol(supplierData.data.invoiceSymbol || "");
        setEmail(supplierData.data.email || "");
        setPhoneNumber(supplierData.data.phoneNumber || "");
        setAddress(supplierData.data.address || "");
      } catch (error) {
        console.error("Error fetching supplier data:", error);
        toast.error(error.message || "Failed to load supplier data");
      }
    };

    fetchSupplierById();
  }, [supplierId]);

  const validatePhoneNumber = (phone) => /^\d{10}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("Số điện thoại phải là 10 chữ số!");
      return;
    }

    // Prepare updated supplier data
    const updatedSupplier = {
      _id: supplierId,
      supplierName,
      contactPerson,
      taxCode,
      invoiceSymbol,
      email,
      phoneNumber,
      address,
    };
    try {
      const response = await fetch(
        `http://localhost:5000/api/suppliers/update/${supplierId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedSupplier),
        }
      );

      if (response.ok) {
        onSave(updatedSupplier); // Notify parent to refresh the supplier list
        onClose(); // Close the modal
      } else {
        toast.error("Không thể cập nhật nhà cung cấp.");
      }
    } catch (error) {
      console.error("Error updating supplier:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật nhà cung cấp.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-700 text-gray-100 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Cập nhật nhà cung cấp</h2>
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
            <label className="block mb-2 text-sm font-medium">
              Ký hiệu hóa đơn
            </label>
            <input
              type="text"
              value={invoiceSymbol}
              onChange={(e) => setInvoiceSymbol(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
              placeholder="Nhập ký hiệu hóa đơn"
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
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
              placeholder="Nhập số điện thoại"
              required
            />
          </div>
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
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
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

export default EditSupplier;
