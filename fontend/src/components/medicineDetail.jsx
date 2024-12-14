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
    <div className="w-full max-w-4xl mx-auto">
      {/* Thông tin cơ bản */}
      <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Tên thuốc</label>
          <p className="text-sm text-gray-900">{medicine.name || "Không có"}</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Loại thuốc</label>
          <p className="text-sm text-gray-900">{medicine.category?.name || "Không xác định"}</p>       
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Liều lượng</label>
          <p className="text-sm text-gray-900">{medicine.dosage || "Không xác định"}</p>       
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Thuốc kê đơn</label>
          <p className="text-sm text-gray-900">{medicine.prescription || "Không xác định"}</p>       
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Đơn vị tính</label>
          <p className="text-sm text-gray-900">{medicine.unit || "Không xác định"}</p>       
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Tác dụng phụ</label>
          <p className="text-sm text-gray-900">{medicine.sideEffects || "Không xác định"}</p>       
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Hướng dẫn sử dụng</label>
          <p className="text-sm text-gray-900">{medicine.instructions || "Không xác định"}</p>       
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Mô tả</label>
          <p className="text-sm text-gray-900">{medicine.description || "Không xác định"}</p>       
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Số lượng</label>
          <p className="text-sm text-gray-900">{medicine.quantity || 0}</p>       
        </div>
      </form>
      {latestImport ? (
        <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Số lô</label>
            <p className="text-sm text-gray-900">{latestImport.batchNumber || 0}</p>       
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Giá bán sỉ (VNĐ)</label>
            <p className="text-sm text-gray-900">{latestImport.wholesalePrice || 0}</p>       
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Giá bán lẻ (VNĐ)</label>
            <p className="text-sm text-gray-900">{latestImport.retailPrice || 0}</p>       

          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Ngày sản xuất</label>
            <p className="text-sm text-gray-900">{latestImport.manufacturingDate
                  ? new Date(latestImport.manufacturingDate).toISOString().split("T")[0]
                  : ""}</p>       
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Ngày hết hạn</label>
            <p className="text-sm text-gray-900">{latestImport.manufacturingDate
                  ? new Date(latestImport.expiryDate).toISOString().split("T")[0]
                  : ""}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Nhà cung cấp</label>
            <p className="text-sm text-gray-900">{latestImport.supplier}</p>       
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Nơi sản xuất</label>
            <p className="text-sm text-gray-900">{latestImport.manufacturingPlace}</p>       
          </div>
        </form>
      ) : (
        <p>Không có thông tin nhập thuốc gần nhất.</p>
      )}
    </div>
  );
};

export default MedicineDetail;
