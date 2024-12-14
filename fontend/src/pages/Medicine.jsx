import { useEffect, useState } from "react";
import { Trash2, Edit, Eye } from "lucide-react"; // Import Eye icon để xem chi tiết
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import AddMedicineForm from "../components/createMedicine.jsx";
import MedicineDetail from "../components/medicineDetail.jsx";

const MedicineTable = () => {
  const [medicines, setMedicines] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null); // Thông tin thuốc được chọn
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [medicinesPerPage] = useState(6); // Số lượng thuốc mỗi trang

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/medicines/medicines"
        );

        if (!response.ok) {
          const errorData = await response.text(); // Lấy text nếu không phải JSON
          console.error("Error fetching medicines:", errorData);
          toast.error("Lỗi khi tải danh sách thuốc.");
          return;
        }

        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Dữ liệu trả về không phải JSON.");
        }

        const { data } = await response.json();
        const formattedMedicines = data.map((medicine) => ({
          name: medicine.name,
          category: medicine.category?.name || "Không xác định",
          prescription: medicine.prescription,
          quantity: medicine.quantity || 0,
          description: medicine.description,
          price: medicine.price,
          manufacturer: medicine.manufacturer,
          expirationDate: medicine.expirationDate,
          sideEffects: medicine.sideEffects,
          dosage: medicine.dosage,
          storageInstructions: medicine.storageInstructions,
          _id: medicine._id,
        }));

        setMedicines(formattedMedicines);
      } catch (error) {
        console.error("Error fetching medicines:", error);
        toast.error("Lỗi khi tải danh sách thuốc.");
      }
    };

    fetchMedicines();
  }, []);

  const handleAddMedicine = (newMedicine) => {
    setMedicines((prevMedicines) => [...prevMedicines, newMedicine]);
    setShowCreateForm(false);
    toast.success("Thêm thuốc thành công!");
  };

  const handleDelete = async (medicineId) => {
    const deleteMedicine = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/medicines/delete/${medicineId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setMedicines((prevMedicines) =>
            prevMedicines.filter((medicine) => medicine._id !== medicineId)
          );
          toast.success("Xóa thuốc thành công!", {
            autoClose: 5000, // Tự động đóng sau 5 giây
          });
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Không thể xóa thuốc.", {
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.error("Error deleting medicine:", error);
        toast.error("Đã xảy ra lỗi khi xóa thuốc.", {
          autoClose: 5000,
        });
      }
    };

    toast(
      (t) => (
        <div>
          <p>Bạn có chắc muốn xóa thuốc này?</p>
          <div className="flex justify-center space-x-2 mt-2">
            <button
              onClick={() => {
                deleteMedicine(); // Thực hiện xóa
                toast.dismiss(t.id); // Đóng thông báo xác nhận
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Xác nhận
            </button>
            <button
              onClick={() => toast.dismiss(t.id)} // Đóng thông báo xác nhận
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Hủy
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false, // Không tự động đóng
        closeOnClick: false,
        draggable: false,
        style: {
          background: "#ffffff",
          color: "#333",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "16px",
        },
      }
    );
  };

  const handleViewDetail = (medicine) => {
    setSelectedMedicine(medicine);
    setIsDetailModalOpen(true); // Mở modal chi tiết
  };

  // Xác định các mục thuốc cần hiển thị dựa trên trang hiện tại
  const indexOfLastMedicine = currentPage * medicinesPerPage;
  const indexOfFirstMedicine = indexOfLastMedicine - medicinesPerPage;
  const currentMedicines = medicines.slice(
    indexOfFirstMedicine,
    indexOfLastMedicine
  );
  const totalPages = Math.ceil(medicines.length / medicinesPerPage);

  // Thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 relative bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Danh sách thuốc
        </h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Thêm thuốc
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                STT
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Tên thuốc
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Loại thuốc
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Thuốc kê đơn
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Số lượng
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {currentMedicines.length > 0 ? (
              currentMedicines.map((medicine, index) => (
                <tr
                  key={medicine._id || index}
                  className="border-b hover:bg-gray-50 transition duration-300"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {indexOfFirstMedicine + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {medicine.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {medicine.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {medicine.prescription}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {medicine.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800">
                    <div className="flex items-center justify-center space-x-4">
                      {/* Nút Sửa */}
                      <Link
                        to={`/medicines/update/${medicine._id}`}
                        className="text-blue-600 hover:text-blue-800 focus:outline-none flex items-center space-x-1"
                      >
                        <Edit size={20} />
                      </Link>

                      {/* Nút Xóa */}
                      <button
                        className="text-red-600 hover:text-red-800 focus:outline-none flex items-center space-x-1"
                        onClick={() => handleDelete(medicine._id)}
                      >
                        <Trash2 size={20} />
                      </button>

                      {/* Nút Xem Chi tiết */}
                      <button
                        className="text-green-600 hover:text-green-800 focus:outline-none flex items-center space-x-1"
                        onClick={() => handleViewDetail(medicine)}
                      >
                        <Eye size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-sm text-gray-600"
                >
                  Không có thuốc nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {medicines.length > medicinesPerPage && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => paginate(currentPage - 1)}
            className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300 ${
              currentPage === 1 && "opacity-50 cursor-not-allowed"
            }`}
            disabled={currentPage === 1}
          >
            Quay lại
          </button>
          <span className="text-gray-700">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300 ${
              currentPage === totalPages && "opacity-50 cursor-not-allowed"
            }`}
            disabled={currentPage === totalPages}
          >
            Tiếp theo
          </button>
        </div>
      )}

      {/* Add Medicine Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowCreateForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <AddMedicineForm
              onAdd={handleAddMedicine}
              onClose={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}

      {/* View Medicine Detail Modal */}
      {isDetailModalOpen && selectedMedicine && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
            <div className="flex justify-between items-center p-6 bg-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">
                Chi tiết thuốc
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <MedicineDetail
                medicineItem={selectedMedicine}
                onClose={() => setIsDetailModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineTable;
