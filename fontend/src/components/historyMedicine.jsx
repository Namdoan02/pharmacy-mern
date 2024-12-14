import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function HistoryImportDrug() {
  const [importData, setImportData] = useState([]);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    // Hàm lấy danh sách thuốc
    const fetchMedicines = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/medicines/medicines");
        if (!response.ok) {
          const errorData = await response.text(); // Lấy text nếu không phải JSON
          console.error("Error fetching medicines:", errorData);
          toast.error("Lỗi khi tải danh sách thuốc.");
          return;
        }

        const { data } = await response.json();
        setMedicines(data || []); // Lưu danh sách thuốc vào state
      } catch (error) {
        console.error("Error fetching medicines:", error);
        toast.error("Lỗi khi tải danh sách thuốc.");
      }
    };

    // Hàm lấy dữ liệu nhập thuốc
    const fetchImportData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/import-data/import-data");
        const data = await response.json();
        console.log("Fetched Import Data:", data); // Debug dữ liệu nhập
        setImportData(data.importData || []); // Lưu dữ liệu nhập thuốc vào state
      } catch (error) {
        console.error("Error fetching import data:", error);
        toast.error("Không thể tải lịch sử nhập thuốc.");
      }
    };

    fetchMedicines();
    fetchImportData();
  }, []);

  // Hàm tìm thuốc trong danh sách dựa trên medicineId
  const findMedicine = (medicineId) => {
    return medicines.find((medicine) => medicine._id === medicineId);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Lịch sử nhập thuốc</h1>
      </div>
      <div className="bg-slate-300 p-3 border rounded-md">
        <table className="min-w-full bg-white border rounded-lg shadow-lg text-black">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border">STT</th>
              <th className="px-4 py-2 text-left border">Tên Thuốc</th>
              <th className="px-4 py-2 text-left border">Loại Thuốc</th>
              <th className="px-4 py-2 text-left border">Liều Lượng</th>
              <th className="px-4 py-2 text-left border">Công Dụng</th>
              <th className="px-4 py-2 text-left border">Đơn Vị</th>
              <th className="px-4 py-2 text-left border">Số Lượng Nhập</th>
              <th className="px-4 py-2 text-left border">Giá Mua</th>
              <th className="px-4 py-2 text-left border">Giá Bán Lẻ</th>
              <th className="px-4 py-2 text-left border">Giá Bán Sỉ</th>
              <th className="px-4 py-2 text-left border">Số Lô</th>
              <th className="px-4 py-2 text-left border">Ngày Sản Xuất</th>
              <th className="px-4 py-2 text-left border">Ngày Hết Hạn</th>
              <th className="px-4 py-2 text-left border">Ngày Nhập</th>
              <th className="px-4 py-2 text-left border">Nhà Cung Cấp</th>
              <th className="px-4 py-2 text-left border">Nơi Sản Xuất</th>
            </tr>
          </thead>
          <tbody>
            {importData.map((importItem, index) => {
              const medicine = findMedicine(importItem.medicineId); // Tìm thông tin thuốc từ ID
              return (
                <tr key={importItem._id || index} className="border-t">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">
                    {medicine ? medicine.name : "Không có tên thuốc"}
                  </td>
                  <td className="px-4 py-2 border">
                    {medicine ? medicine.category?.name || "Không xác định" : "Không xác định"}
                  </td>
                  <td className="px-4 py-2 border">{medicine?.dosage || "Không có"}</td>
                  <td className="px-4 py-2 border">{medicine?.usage || "Không có"}</td>
                  <td className="px-4 py-2 border">{medicine?.unit || "Không có"}</td>
                  <td className="px-4 py-2 border">{importItem.quantity}</td>
                  <td className="px-4 py-2 border">{importItem.purchasePrice}</td>
                  <td className="px-4 py-2 border">{importItem.retailPrice}</td>
                  <td className="px-4 py-2 border">{importItem.wholesalePrice}</td>
                  <td className="px-4 py-2 border">{importItem.batchNumber}</td>
                  <td className="px-4 py-2 border">
                    {new Date(importItem.manufacturingDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(importItem.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(importItem.importDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">{importItem.supplier}</td>
                  <td className="px-4 py-2 border">{importItem.manufacturingPlace}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoryImportDrug;
