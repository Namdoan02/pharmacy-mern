import { useState } from "react";
import { toast } from "react-toastify";

const PrescriptionInvoice = ({ setCustomerInfo }) => {
  const [customerName, setCustomerName] = useState(""); // Tên khách hàng
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState(""); // Số điện thoại khách hàng
  const [existingCustomer, setExistingCustomer] = useState(null); // Lưu thông tin khách hàng đã tìm thấy
  const [hospitalName, setHospitalName] = useState(""); // Nơi khám
  const [medicalCode, setMedicalCode] = useState(""); // Mã phiếu khám

  // Update parent component with customer data
  const handleUpdateCustomerInfo = (key, value) => {
    setCustomerInfo((prevInfo) => ({
      ...prevInfo,
      [key]: value,
    }));
  };

  // Tìm kiếm khách hàng từ API
  const searchCustomer = async (name, phone) => {
    if (!name && !phone) {
      toast.error("Vui lòng nhập tên hoặc số điện thoại để tìm kiếm.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/customers/search?name=${name}&phone=${phone}`
      );
      const data = await response.json();

      if (response.ok && data.customers.length > 0) {
        const customer = data.customers[0]; // Lấy khách hàng đầu tiên từ danh sách trả về
        setExistingCustomer(customer);
        setCustomerName(customer.name);
        setCustomerPhoneNumber(customer.phoneNumber);

        // Cập nhật thông tin khách hàng trong parent component
        setCustomerInfo({
          name: customer.name,
          phoneNumber: customer.phoneNumber,
          hospitalName,
          medicalCode,
        });

        toast.success("Tìm thấy khách hàng.");
      } else {
        setExistingCustomer(null);
        toast.info("Không tìm thấy khách hàng với thông tin này.");
      }
    } catch (err) {
      console.error("Error searching customer:", err);
      toast.error("Lỗi kết nối với server.");
    }
  };

  // Thêm khách hàng mới
  const addNewCustomer = async () => {
    if (!customerName || !customerPhoneNumber) {
      toast.error("Vui lòng nhập đầy đủ thông tin khách hàng.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/customers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: customerName,
          phoneNumber: customerPhoneNumber,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Khách hàng đã được tạo thành công!");
        setExistingCustomer(data.customer);

        // Cập nhật thông tin khách hàng trong parent component
        setCustomerInfo({
          name: data.customer.name,
          phoneNumber: data.customer.phoneNumber,
          hospitalName,
          medicalCode,
        });
      } else {
        toast.error(data.message || "Lỗi khi tạo khách hàng.");
      }
    } catch (err) {
      console.error("Error adding customer:", err);
      toast.error("Lỗi kết nối với server.");
    }
  };

  // Xóa thông tin khách hàng
  const removeCustomer = () => {
    setCustomerName("");
    setCustomerPhoneNumber("");
    setExistingCustomer(null);
    setHospitalName("");
    setMedicalCode("");
    setCustomerInfo({
      name: "",
      phoneNumber: "",
      hospitalName: "",
      medicalCode: "",
    });
    toast.success("Đã xóa thông tin khách hàng.");
  };

  return (
    <div>
      <form className="flex flex-col sm:flex-row gap-4">
        {/* Thông Tin Khách Hàng */}
        <div className="w-full sm:w-1/2 bg-gray-50 p-4 rounded-md shadow">
          <h4 className="font-semibold mb-3 text-blue-500">Thông tin khách hàng</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Tên khách hàng"
              className="border p-2 w-full rounded"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                handleUpdateCustomerInfo("name", e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              className="border p-2 w-full rounded"
              value={customerPhoneNumber}
              onChange={(e) => {
                setCustomerPhoneNumber(e.target.value);
                handleUpdateCustomerInfo("phoneNumber", e.target.value);
              }}
            />
            <button
              type="button"
              onClick={() => searchCustomer(customerName, customerPhoneNumber)}
              className="w-full py-2 bg-blue-500 text-white rounded mt-2"
            >
              Tìm kiếm khách hàng
            </button>
            <button
              type="button"
              onClick={existingCustomer ? removeCustomer : addNewCustomer}
              className={`w-full py-2 mt-2 ${existingCustomer ? "bg-red-500" : "bg-green-500"} text-white rounded`}
            >
              {existingCustomer ? "Xóa thông tin khách hàng" : "Thêm khách hàng mới"}
            </button>
          </div>
        </div>

        {/* Thông Tin Nơi Khám */}
        <div className="w-full sm:w-1/2 bg-gray-50 p-4 rounded-md shadow">
          <h4 className="font-semibold mb-3 text-green-500">Thông tin nơi cấp đơn thuốc</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nơi khám"
              className="border p-2 w-full rounded"
              value={hospitalName}
              onChange={(e) => {
                setHospitalName(e.target.value);
                handleUpdateCustomerInfo("hospitalName", e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Mã phiếu khám"
              className="border p-2 w-full rounded"
              value={medicalCode}
              onChange={(e) => {
                setMedicalCode(e.target.value);
                handleUpdateCustomerInfo("medicalCode", e.target.value);
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionInvoice;
