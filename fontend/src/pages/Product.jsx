import { useEffect, useState, useRef } from "react";
import AddMedicineForm from "../components/createMedicine";
import { Trash2, Edit, Eye } from "lucide-react"; // Import Eye icon để xem chi tiết
import { toast } from "react-toastify";
import EditMedicineForm from "../components/updateMedicine";
import MedicineDetail from "../components/medicineDetail"; // Đảm bảo bạn có component này

const MedicineTable = () => {
  const [medicines, setMedicines] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editMedicine, setEditMedicine] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Trạng thái hiển thị modal chi tiết
  const [selectedMedicine, setSelectedMedicine] = useState(null); // Thông tin thuốc được chọn
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/medicines/medicines");
    
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
          quantity: medicine.quantity,
          _id: medicine._id // Ensure we are storing the medicine ID.
        }));
    
        setMedicines(formattedMedicines);
      } catch (error) {
        console.error("Error fetching medicines:", error);
        toast.error("Lỗi khi tải danh sách thuốc.");
      }
    };

    fetchMedicines();
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleAddMedicine = (newMedicine) => {
    setMedicines((prevMedicines) => [...prevMedicines, newMedicine]);
    setShowCreateForm(false);
    toast.success("Thêm thuốc thành công!");
  };

  const handleEdit = (medicine) => {
    setEditMedicine(medicine);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedMedicine) => {
    setMedicines((prevMedicines) =>
      prevMedicines.map((medicine) =>
        medicine._id === updatedMedicine._id ? updatedMedicine : medicine
      )
    );
    setIsEditModalOpen(false); // Đóng modal khi lưu thành công
  };
  

  const handleDelete = async (medicineId) => {
    const response = await fetch(
      `http://localhost:5000/api/medicines/delete/${medicineId}`,
      { method: "DELETE" }
    );

    if (response.ok) {
      setMedicines((prevMedicines) =>
        prevMedicines.filter((medicine) => medicine._id !== medicineId)
      );
      toast.success("Xóa thuốc thành công!");
    } else {
      toast.error("Xóa thuốc thất bại.");
    }
  };

  const handleViewDetail = (medicine) => {
    setSelectedMedicine(medicine);
    setIsDetailModalOpen(true); // Mở modal chi tiết
  };

  return (
    <div className="p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Danh sách thuốc</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Thêm thuốc
        </button>
      </div>
      <div className="bg-slate-300 full-h-screen p-3 border rounded-md">
        <table className="min-w-full bg-white border rounded-lg shadow-lg text-black">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border">STT</th>
              <th className="px-4 py-2 text-left border">Tên thuốc</th>
              <th className="px-4 py-2 text-left border">Loại thuốc</th>
              <th className="px-4 py-2 text-left border">Thuốc kê đơn</th>
              <th className="px-4 py-2 text-left border">Số lượng</th>
              <th className="px-4 py-2 text-left border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine, index) => (
              <tr key={medicine._id || index} className="border-t">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{medicine.name}</td>
                <td className="px-4 py-2 border">{medicine.category}</td>
                <td className="px-4 py-2 border">{medicine.prescription}</td>
                <td className="px-4 py-2 border">{medicine.quantity}</td>
                <td className="px-4 py-2 text-center relative">
                  <button
                    ref={buttonRef}
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => toggleDropdown(index)}
                  >
                    •••
                  </button>
                  {activeDropdown === index && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10"
                    >
                      <ul className="py-1 text-gray-700">
                        <div
                          onClick={() => handleEdit(medicine)}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <Edit className="mr-2" />
                          Sửa
                        </div>
                        <div
                          onClick={() => handleDelete(medicine._id)}
                          className="flex items-center px-4 py-2 text-red-500 hover:bg-red-100 cursor-pointer"
                        >
                          <Trash2 className="mr-2" /> Xóa
                        </div>
                        <div
                          onClick={() => handleViewDetail(medicine)} // Thêm chức năng xem chi tiết
                          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <Eye className="mr-2" /> Xem chi tiết
                        </div>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Modal */}
        {isEditModalOpen && editMedicine && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="rounded-lg w-full max-w-lg bg-white p-6 shadow-xl">
              <EditMedicineForm
                medicine={editMedicine}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
              />
            </div>
          </div>
        )}

        {/* Add Medicine Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="rounded-lg w-full max-w-lg bg-white p-6 shadow-xl">
              <AddMedicineForm
                onAdd={handleAddMedicine}
                onClose={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        )}

        {/* View Medicine Detail Modal */}
        {isDetailModalOpen && selectedMedicine && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="rounded-lg w-full max-w-lg bg-white p-6 shadow-xl">
              <MedicineDetail
                medicine={selectedMedicine}
                onClose={() => setIsDetailModalOpen(false)} // Đóng modal
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineTable;
