import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ImportMedicineForm = ({ onClose, medicineId }) => {
  const [importData, setImportData] = useState({
    quantity: 0,
    purchasePrice: "",
    retailPrice: "",
    wholesalePrice: "",
    batchNumber: "",
    manufacturingDate: "",
    expiryDate: "",
    importDate: "",
    supplier: "",
    manufacturingPlace: "",
    medicineId: "",
  });

  const [suppliers, setSuppliers] = useState([]);

  const handleImportChange = (e) => {
    const { name, value } = e.target;
    setImportData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleCancel = () => {
    onClose(); // Đóng form khi nhấn Hủy
  };
  const handleImportSubmit = async () => {
    if (
      !importData.quantity ||
      !importData.purchasePrice ||
      !importData.supplier
    ) {
      toast.error("Số lượng, giá nhập và nhà cung cấp là bắt buộc!");
      return;
    }

    if (!medicineId) {
      toast.error("Không xác định được ID của thuốc!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/medicines/import/${medicineId}`, // Endpoint API xử lý nhập thuốc
        {
          method: "POST", // Đổi sang phương thức POST
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(importData), // Gửi dữ liệu nhập thuốc
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Không thể nhập thuốc.");
        return;
      }

      toast.success("Nhập thuốc thành công!");
      setImportData({
        quantity: 0,
        purchasePrice: "",
        retailPrice: "",
        wholesalePrice: "",
        batchNumber: "",
        manufacturingDate: "",
        expiryDate: "",
        importDate: new Date().toISOString().split("T")[0], // Reset ngày nhập về hôm nay
        supplier: "",
        manufacturingPlace: "",
      });

      onClose(); // Đóng form nhập thuốc sau khi thành công
    } catch (error) {
      console.error("Error submitting import data:", error);
      toast.error("Đã xảy ra lỗi khi nhập thuốc.");
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setImportData((prevData) => ({
      ...prevData,
      importDate: today,
      medicineId: medicineId || "",
    }));

    const fetchSuppliers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/suppliers/suppliers"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch updated supplier list");
        }
        const data = await response.json();
        setSuppliers(data.data || []); // Cập nhật danh sách nhà cung cấp vào state
      } catch (error) {
        console.error("Error fetching updated supplier list:", error);
        toast.error("Không thể tải danh sách nhà cung cấp.");
      }
    };

    // Fetch existing import data for the medicine
    const fetchImportData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/medicines/import-data/${medicineId}` // API để lấy dữ liệu nhập gần nhất
        );
        if (!response.ok) {
          throw new Error("Failed to fetch import data");
        }
        const data = await response.json();
        if (data.data) {
          const importDetails = data.data;

          setImportData((prevData) => ({
            ...prevData,
            ...importDetails,
            importDate: today, // Gán ngày hiện tại nếu không có ngày nhập
            manufacturingDate: importDetails.manufacturingDate
              ? new Date(importDetails.manufacturingDate)
                  .toISOString()
                  .split("T")[0]
              : "", // Định dạng ngày sản xuất
            expiryDate: importDetails.expiryDate
              ? new Date(importDetails.expiryDate).toISOString().split("T")[0]
              : "", // Định dạng ngày hết hạn
          }));
        }
      } catch (error) {
        console.error("Error fetching import data:", error);
        toast.error("Không thể tải dữ liệu nhập thuốc.");
      }
    };

    fetchSuppliers();
    fetchImportData(); // Gọi API lấy dữ liệu nhập thuốc
  }, [medicineId]);

  return (
    <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Nhập Thuốc
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
        {/* Số lượng */}
        <div className="space-y-1">
          <label
            htmlFor="quantity"
            className="text-sm font-medium text-gray-600"
          >
            Số lượng
          </label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            value={importData.quantity}
            onChange={handleImportChange}
          />
        </div>

        {/* Giá nhập */}
        <div className="space-y-1">
          <label
            htmlFor="purchasePrice"
            className="text-sm font-medium text-gray-600"
          >
            Giá nhập (VNĐ)
          </label>
          <input
            type="number"
            name="purchasePrice"
            id="purchasePrice"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            value={importData.purchasePrice}
            onChange={handleImportChange}
          />
        </div>

        {/* Giá bán lẻ */}
        <div className="space-y-1">
          <label
            htmlFor="retailPrice"
            className="text-sm font-medium text-gray-600"
          >
            Giá bán lẻ (VNĐ)
          </label>
          <input
            type="number"
            name="retailPrice"
            id="retailPrice"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            value={importData.retailPrice}
            onChange={handleImportChange}
          />
        </div>

        {/* Giá bán sỉ */}
        <div className="space-y-1">
          <label
            htmlFor="wholesalePrice"
            className="text-sm font-medium text-gray-600"
          >
            Giá bán sỉ (VNĐ)
          </label>
          <input
            type="number"
            name="wholesalePrice"
            id="wholesalePrice"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            value={importData.wholesalePrice}
            onChange={handleImportChange}
          />
        </div>

        {/* Số lô */}
        <div className="space-y-1">
          <label
            htmlFor="batchNumber"
            className="text-sm font-medium text-gray-600"
          >
            Số lô
          </label>
          <input
            type="text"
            name="batchNumber"
            id="batchNumber"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            value={importData.batchNumber}
            onChange={handleImportChange}
          />
        </div>

        {/* Ngày sản xuất */}
        <div className="space-y-1">
          <label
            htmlFor="manufacturingDate"
            className="text-sm font-medium text-gray-600"
          >
            Ngày sản xuất
          </label>
          <input
            type="date"
            name="manufacturingDate"
            id="manufacturingDate"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            value={importData.manufacturingDate}
            onChange={handleImportChange}
          />
        </div>

        {/* Ngày hết hạn */}
        <div className="space-y-1">
          <label
            htmlFor="expiryDate"
            className="text-sm font-medium text-gray-600"
          >
            Ngày hết hạn
          </label>
          <input
            type="date"
            name="expiryDate"
            id="expiryDate"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            value={importData.expiryDate}
            onChange={handleImportChange}
          />
        </div>

        {/* Ngày nhập */}
        <div className="space-y-1">
          <label
            htmlFor="importDate"
            className="text-sm font-medium text-gray-600"
          >
            Ngày nhập
          </label>
          <input
            type="date"
            name="importDate"
            id="importDate"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            value={importData.importDate}
            onChange={handleImportChange}
          />
        </div>

        {/* Nhà cung cấp */}
        <div className="space-y-2 ">
          <label
            htmlFor="supplier"
            className="text-sm font-medium text-gray-600"
          >
            Nhà cung cấp
          </label>
          <select
            name="supplier"
            id="supplier"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 text-black"
            value={importData.supplier}
            onChange={handleImportChange}
          >
            <option value="">Chọn nhà cung cấp</option>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier.supplierName}>
                {supplier.supplierName}
              </option>
            ))}
          </select>
        </div>

        {/* Nơi sản xuất */}
        <div className="space-y-2">
          <label
            htmlFor="manufacturingPlace"
            className="text-sm font-medium text-gray-600"
          >
            Nơi sản xuất
          </label>
          <input
            type="text"
            name="manufacturingPlace"
            id="manufacturingPlace"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            value={importData.manufacturingPlace}
            onChange={handleImportChange}
          />
        </div>
      </div>

      {/* Các nút hành động */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Nút Hủy */}
        <button
          onClick={handleCancel} // Quay lại trang trước đó
          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 w-full"
        >
          Hủy
        </button>

        {/* Nút Nhập thuốc */}
        <button
          onClick={handleImportSubmit}
          className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 w-full"
        >
          Nhập Thuốc
        </button>
      </div>
    </div>
  );
};

export default ImportMedicineForm;
