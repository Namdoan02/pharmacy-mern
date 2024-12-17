import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const HistoryImportDrug = ({ medicineId }) => {
  const [importHistory, setImportHistory] = useState([]); // Lịch sử nhập kho
  const [loading, setLoading] = useState(true); // Tình trạng tải dữ liệu
  const [error, setError] = useState(null); // Xử lý lỗi
  const hasShownToast = useRef(false); // Flag để kiểm soát toast

  // Hàm fetch lịch sử nhập kho dựa trên ID thuốc
  const fetchImportHistory = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/medicines/import-history/${id}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          return []; // Trả về mảng rỗng nếu không có lịch sử nhập
        }
        throw new Error(`Không thể lấy lịch sử nhập kho, mã lỗi: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (err) {
      console.error(err.message);
      return [];
    }
  };

  // useEffect để gọi API khi component mount
  useEffect(() => {
    const loadImportHistory = async () => {
      try {
        setLoading(true);
        const historyData = await fetchImportHistory(medicineId);

        setImportHistory(historyData);

        // Chỉ hiển thị toast nếu chưa hiển thị và không có dữ liệu
        if (historyData.length === 0 && !hasShownToast.current) {
          toast.info("Chưa có lịch sử nhập thuốc.");
          hasShownToast.current = true; // Đặt cờ đã hiển thị
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (medicineId) {
      loadImportHistory();
    } else {
      toast.error("ID thuốc không hợp lệ.");
      setError("ID thuốc không hợp lệ.");
      setLoading(false);
    }
  }, [medicineId]);

  // Hiển thị khi đang tải
  if (loading) {
    return <p>Đang tải lịch sử nhập kho...</p>;
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Hiển thị khi không có dữ liệu lịch sử
  if (importHistory.length === 0) {
    return null;
  }

  // Hiển thị lịch sử nhập kho
  return (
    <div className="overflow-x-auto">
      <h3 className="text-xl font-semibold mb-4">Lịch Sử Nhập Thuốc</h3>
      {importHistory.map((record, index) => (
        <div
          key={index}
          className="mb-4 p-4 shadow-sm rounded bg-gray-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <p><strong>Số lô:</strong> {record.batchNumber || "Không có"}</p>
          <p><strong>Số lượng:</strong> {record.quantity || "Không có"}</p>
          <p><strong>Giá bán sỉ (VNĐ):</strong> {record.wholesalePrice || "Không có"} đ</p>
          <p><strong>Giá bán lẻ (VNĐ):</strong> {record.retailPrice || "Không có"} đ</p>
          <p><strong>Giá nhập (VNĐ):</strong> {record.purchasePrice || "Không có"} đ</p>
          <p><strong>Ngày nhập:</strong> {record.importDate ? new Date(record.importDate).toLocaleDateString()
              : "Không có"}</p>
          <p>
            <strong>Ngày sản xuất:</strong>{" "}
            {record.manufacturingDate
              ? new Date(record.manufacturingDate).toLocaleDateString()
              : "Không có"}
          </p>
          <p>
            <strong>Ngày hết hạn:</strong>{" "}
            {record.expiryDate
              ? new Date(record.expiryDate).toLocaleDateString()
              : "Không có"}
          </p>
          <p><strong>Nhà cung cấp:</strong> {record.supplier || "Không có"}</p>
          <p><strong>Nơi sản xuất:</strong> {record.manufacturingPlace || "Không có"}</p>
        </div>
      ))}
    </div>
  );
};

export default HistoryImportDrug;
