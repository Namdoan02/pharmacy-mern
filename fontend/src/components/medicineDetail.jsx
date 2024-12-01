import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  // Lấy ID từ URL params
import { toast } from "react-toastify";  // Đảm bảo bạn đã cài react-toastify

const MedicineDetail = () => {
  const { id } = useParams();  // Lấy id thuốc từ URL params
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra nếu id hợp lệ trước khi gọi API
    if (!id) {
      toast.error("ID thuốc không hợp lệ.");
      return;
    }

    // Hàm lấy chi tiết thuốc theo ID
    const fetchMedicineDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/medicines/medicines/${id}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch medicine data: ${id}`);
        }

        const data = await response.json();

        if (data.data) {
          setMedicine(data.data);  // Lưu dữ liệu thuốc vào state
        } else {
          toast.error("Không tìm thấy thông tin thuốc");
        }
      } catch (error) {
        console.error("Error fetching medicine details:", error);
        toast.error(error.message || "Lỗi khi lấy thông tin thuốc");
      } finally {
        setLoading(false);  // Hoàn thành việc lấy dữ liệu
      }
    };

    fetchMedicineDetails();  // Gọi API khi component mount hoặc id thay đổi
  }, [id]);  // Lắng nghe thay đổi của id

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return <p>Đang tải thông tin thuốc...</p>;
  }

  // Nếu không có dữ liệu thuốc
  if (!medicine) {
    return <p>Không tìm thấy thông tin thuốc</p>;
  }

  // Hiển thị chi tiết thuốc
  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Chi tiết thuốc</h2>

      <div className="space-y-4">
        <div>
          <strong>Tên thuốc:</strong>
          <p>{medicine.name}</p>
        </div>

        <div>
          <strong>Loại thuốc:</strong>
          <p>{medicine.category?.name || "Không xác định"}</p>
        </div>

        <div>
          <strong>Liều lượng:</strong>
          <p>{medicine.dosage}</p>
        </div>

        <div>
          <strong>Công dụng:</strong>
          <p>{medicine.usage}</p>
        </div>

        <div>
          <strong>Đơn vị tính:</strong>
          <p>{medicine.unit}</p>
        </div>

        <div>
          <strong>Thuốc kê đơn:</strong>
          <p>{medicine.prescription}</p>
        </div>

        <div>
          <strong>Quy cách đóng gói:</strong>
          <p>{medicine.packaging}</p>
        </div>

        <div>
          <strong>Tác dụng phụ:</strong>
          <p>{medicine.sideEffects}</p>
        </div>

        <div>
          <strong>Hướng dẫn sử dụng:</strong>
          <p>{medicine.instructions}</p>
        </div>

        <div>
          <strong>Mô tả:</strong>
          <p>{medicine.description}</p>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetail;
