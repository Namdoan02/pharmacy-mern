import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const MedicineDetail = ({ medicineItem }) => {
  const id = medicineItem._id;
  const [medicine, setMedicine] = useState(null);
  const [latestImport, setLatestImport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      toast.error("ID thuốc không hợp lệ.");
      setLoading(false);
      return;
    }

    const fetchMedicineDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/medicines/medicines/${id}`
        );

        if (!response.ok) {
          throw new Error(`Không thể lấy dữ liệu thuốc, mã lỗi: ${response.status}`);
        }

        const data = await response.json();
        console.log("Dữ liệu thuốc nhận được:", data);

        if (data && data.data) {
          setMedicine(data.data);

          // Lấy lần nhập thuốc gần nhất
          const importDetails = data.data.importDetails || [];
          if (importDetails.length > 0) {
            setLatestImport(importDetails[importDetails.length - 1]); // Lấy phần tử cuối cùng
          }
        } else {
          toast.error("Không tìm thấy thông tin thuốc.");
          setMedicine(null);
        }
      } catch (error) {
        console.error("Error fetching medicine details:", error);
        toast.error(error.message || "Lỗi khi lấy thông tin thuốc.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicineDetails();
  }, [id]);

  if (loading) {
    return <p>Đang tải thông tin thuốc...</p>;
  }

  if (!medicine) {
    return <p>Không tìm thấy thông tin thuốc cho ID: {id}</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Thông tin cơ bản */}
      <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Tên thuốc</label>
          <input
            type="text"
            value={medicine.name || "Không có"}
            className="border border-gray-300 rounded-lg p-3 w-full bg-gray-100 cursor-not-allowed"
            disabled
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Loại thuốc</label>
          <input
            type="text"
            value={medicine.category?.name || "Không xác định"}
            className="border border-gray-300 rounded-lg p-3 w-full bg-gray-100 cursor-not-allowed"
            disabled
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Liều lượng</label>
          <input
            type="text"
            value={medicine.dosage || "Không xác định"}
            className="border border-gray-300 rounded-lg p-3 w-full bg-gray-100 cursor-not-allowed"
            disabled
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Đơn vị tính</label>
          <input
            type="text"
            value={medicine.unit || "Không xác định"}
            className="border border-gray-300 rounded-lg p-3 w-full bg-gray-100 cursor-not-allowed"
            disabled
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Số lượng</label>
          <input
            type="number"
            value={medicine.quantity || 0}
            className="border border-gray-300 rounded-lg p-3 w-full bg-gray-100 cursor-not-allowed"
            disabled
          />
        </div>
      </form>
      {latestImport ? (
        <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Giá nhập</label>
            <input
              type="text"
              value={latestImport.purchasePrice || "Không có"}
              className="border border-gray-300 rounded-lg p-3 w-full bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Giá bán lẻ</label>
            <input
              type="text"
              value={latestImport.retailPrice || "Không có"}
              className="border border-gray-300 rounded-lg p-3 w-full bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Ngày sản xuất</label>
            <input
              type="date"
              value={
                latestImport.manufacturingDate
                  ? new Date(latestImport.manufacturingDate).toISOString().split("T")[0]
                  : ""
              }
              className="border border-gray-300 rounded-lg p-3 w-full bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Ngày hết hạn</label>
            <input
              type="date"
              value={
                latestImport.expiryDate
                  ? new Date(latestImport.expiryDate).toISOString().split("T")[0]
                  : ""
              }
              className="border border-gray-300 rounded-lg p-3 w-full bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Nhà cung cấp</label>
            <input
              type="text"
              value={latestImport.supplier || "Không có"}
              className="border border-gray-300 rounded-lg p-3 w-full bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Nơi sản xuất</label>
            <input
              type="text"
              value={latestImport.manufacturingPlace || "Không có"}
              className="border border-gray-300 rounded-lg p-3 w-full bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
        </form>
      ) : (
        <p>Không có thông tin nhập thuốc gần nhất.</p>
      )}
    </div>
  );
};

export default MedicineDetail;
