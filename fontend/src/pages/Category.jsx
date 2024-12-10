import { useEffect, useState } from "react";
import AddMedicineCategory from "../components/createCategory";
import EditMedicineCategory from "../components/updateCategory";
import { Trash2, Edit } from "lucide-react";
import { toast } from "react-toastify";

const MedicineCategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Số lượng mục trên mỗi trang

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/categories/categories",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message || "Failed to fetch categories");
          return;
        }

        const data = await response.json();
        setCategories(data.data || []);
      } catch {
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
    setShowCreateForm(false);
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedCategory) => {
    const categoryId = updatedCategory._id || updatedCategory.data?._id;

    if (!categoryId) {
      toast.error("Dữ liệu loại thuốc không hợp lệ hoặc thiếu ID!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/categories/update/${categoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCategory),
        }
      );

      if (response.ok) {
        const fetchCategories = async () => {
          const response = await fetch(
            "http://localhost:5000/api/categories/categories"
          );
          const data = await response.json();
          setCategories(data.data || []);
        };

        await fetchCategories();
        setIsEditModalOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Không thể cập nhật loại thuốc.");
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi cập nhật loại thuốc.");
    }
  };

  const handleDelete = async (categoryId) => {
    const deleteCategory = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/categories/delete/${categoryId}`,
          {
            method: "DELETE",
          }
        );
  
        if (response.ok) {
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category._id !== categoryId)
          );
          toast.success("Xóa loại thuốc thành công!", {
            duration: 5000, // Toast tự động đóng sau 5 giây
          });
        } else {
          const errorData = await response.json();
          toast.error(
            errorData.message || "Xóa loại thuốc thất bại.",
            { duration: 5000 }
          );
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Đã xảy ra lỗi khi xóa loại thuốc.", {
          duration: 5000,
        });
      }
    };
  
    toast(
      (t) => (
        <div>
          <p>Bạn có chắc muốn xóa loại thuốc này?</p>
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => {
                deleteCategory();
                toast.dismiss(t.id); // Đóng toast xác nhận
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Xác nhận
            </button>
            <button
              onClick={() => toast.dismiss(t.id)} // Đóng toast xác nhận
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Hủy
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center", // Hiển thị ở giữa trên cùng
        duration: 5000, // Toast tự động đóng sau 5 giây
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

  // Tính toán dữ liệu hiển thị
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  return (
    <div className="p-6 relative bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          Danh sách loại thuốc
        </h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
        >
          Tạo mới
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-4 text-gray-600 font-medium text-sm uppercase tracking-wider border-b">
                STT
              </th>
              <th className="px-6 py-4 text-gray-600 font-medium text-sm uppercase tracking-wider border-b">
                Tên Loại Thuốc
              </th>
              <th className="px-6 py-4 text-gray-600 font-medium text-sm uppercase tracking-wider border-b">
                Mô tả chung
              </th>
              <th className="px-6 py-4 text-gray-600 font-medium text-sm uppercase tracking-wider border-b">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentCategories.length > 0 ? (
              currentCategories.map((category, index) => (
                <tr
                  key={category._id || index}
                  className="hover:bg-gray-100 transition duration-300"
                >
                  <td className="px-6 py-4 text-gray-800 text-sm border-b">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-6 py-4 text-gray-800 text-sm border-b">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-gray-800 text-sm border-b">
                    {category.description}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-800 text-sm border-b">
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        className="text-blue-600 hover:text-blue-800 focus:outline-none"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                        onClick={() => handleDelete(category._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-4 text-center text-gray-500 text-sm"
                >
                  Không có dữ liệu loại thuốc.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Phân trang */}
        {categories.length > itemsPerPage && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-t">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Quay lại
            </button>
            <span className="text-gray-600 text-sm">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              Tiếp theo
            </button>
          </div>
        )}
      </div>

      {/* Create and Edit Modals */}
      {isEditModalOpen && editCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
            <EditMedicineCategory
              category={editCategory}
              onSave={handleSave}
              onClose={() => setIsEditModalOpen(false)}
            />
          </div>
        </div>
      )}

      {showCreateForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
            <AddMedicineCategory
              onClose={() => setShowCreateForm(false)}
              onAdd={handleAddCategory}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineCategoryTable;
