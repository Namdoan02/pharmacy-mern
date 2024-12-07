import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const MedicineDetail = () => {
  const { id } = useParams(); 
  console.log("ID thuốc từ URL:", id); // Lấy id thuốc từ URL params

  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra nếu id hợp lệ trước khi gọi API
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
        console.log("Dữ liệu thuốc nhận được:", data); // Log dữ liệu trả về từ API

        if (data && data.data) {
          setMedicine(data.data); // Lưu dữ liệu thuốc vào state
        } else {
          toast.error("Không tìm thấy thông tin thuốc.");
          setMedicine(null);  // Đảm bảo rằng state được set null nếu không có dữ liệu
        }
      } catch (error) {
        console.error("Error fetching medicine details:", error);
        toast.error(error.message || "Lỗi khi lấy thông tin thuốc.");
      } finally {
        setLoading(false); // Hoàn thành việc lấy dữ liệu
      }
    };

    fetchMedicineDetails(); // Gọi API khi component mount hoặc id thay đổi
  }, [id]); // Lắng nghe thay đổi của id

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return <p>Đang tải thông tin thuốc...</p>;
  }

  // Nếu không có dữ liệu thuốc
  console.log("Dữ liệu thuốc:", medicine);  // Log trạng thái của medicine
  if (!medicine) {
    return <p>Không tìm thấy thông tin thuốc cho ID: {id}</p>;
  }

  // Hiển thị chi tiết thuốc
  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Chi tiết thuốc</h2>

      <table className="min-w-full table-auto border-collapse border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">STT</th>
            <th className="px-4 py-2 border">Tên thuốc</th>
            <th className="px-4 py-2 border">Loại thuốc</th>
            <th className="px-4 py-2 border">Thuốc kê đơn</th>
            <th className="px-4 py-2 border">Liều lượng</th>
            <th className="px-4 py-2 border">Đơn vị tính</th>
            <th className="px-4 py-2 border">Quy cách đóng gói</th>
            <th className="px-4 py-2 border">Tác dụng phụ</th>
            <th className="px-4 py-2 border">Hướng dẫn sử dụng</th>
            <th className="px-4 py-2 border">Mô tả</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-4 py-2 border">1</td>
            <td className="px-4 py-2 border">{medicine.name}</td>
            <td className="px-4 py-2 border">{medicine.category?.name || "Không xác định"}</td>
            <td className="px-4 py-2 border">{medicine.prescription ? "Có" : "Không"}</td>
            <td className="px-4 py-2 border">{medicine.dosage}</td>
            <td className="px-4 py-2 border">{medicine.unit}</td>
            <td className="px-4 py-2 border">{medicine.packaging}</td>
            <td className="px-4 py-2 border">{medicine.sideEffects || "Không có"}</td>
            <td className="px-4 py-2 border">{medicine.instructions || "Không có"}</td>
            <td className="px-4 py-2 border">{medicine.description || "Không có"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MedicineDetail;
