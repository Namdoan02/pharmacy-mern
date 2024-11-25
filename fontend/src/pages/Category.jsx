import { useEffect, useState, useRef } from "react";
import AddMedicineCategory from "../components/createCategory";
import EditMedicineCategory from "../components/updateCategory";
import { Trash2, UserRoundPen } from "lucide-react";
import { toast } from "react-toastify";

const MedicineCategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Fetch categories on component mount
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
          console.error("Error fetching categories:", errorData);
          toast.error(errorData.message || "Failed to fetch categories");
          return;
        }

        const data = await response.json();
        console.log("Fetched Categories:", data); // Debug the response
        setCategories(data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();

    // Handle clicks outside of dropdown
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
      console.error(
        "Error: Updated category does not contain a valid ID.",
        updatedCategory
      );
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
        // Fetch the updated category list
        const fetchCategories = async () => {
          try {
            const response = await fetch(
              "http://localhost:5000/api/categories/categories"
            );
            if (!response.ok) {
              throw new Error("Failed to fetch updated category list");
            }
            const data = await response.json();
            setCategories(data.data || []); // Update the category list in state
            console.log("Updated category list:", data.data); // Log the list for debugging
          } catch (error) {
            console.error("Error fetching updated category list:", error);
            toast.error("Không thể tải danh sách loại thuốc.");
          }
        };

        await fetchCategories(); // Fetch and update the category list
        setIsEditModalOpen(false); // Close the modal after successful update
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Không thể cập nhật loại thuốc.");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật loại thuốc.");
    }
  };

  const handleDelete = async (categoryId) => {
    const deleteCategory = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/categories/delete/${categoryId}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          // Update the state to remove the deleted category
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category._id !== categoryId)
          );

          toast.success("Loại thuốc đã được xóa thành công!");
        } else {
          const errorData = await response.json();
          console.error("Failed to delete category:", errorData);
          toast.error(errorData.message || "Xóa loại thuốc thất bại.");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Đã xảy ra lỗi khi xóa loại thuốc.");
      }
    };

    toast(
      (t) => (
        <div>
          <p>Bạn có chắc chắn muốn xóa loại thuốc này không?</p>
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => {
                deleteCategory();
                toast.dismiss(t.id);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Xác nhận
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Hủy
            </button>
          </div>
        </div>
      ),
      { position: "top-center", autoClose: false }
    );
  };

  return (
    <div className="p-6 relative ">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Danh sách loại thuốc</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Tạo mới
        </button>
      </div>
      <div className="bg-slate-300 p-3 border rounded-md text-black">
        <table className="min-w-full bg-white border rounded-lg shadow-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border">STT</th>
              <th className="px-4 py-2 text-left border">Tên Loại Thuốc</th>
              <th className="px-4 py-2 text-left border">Mô tả</th>
              <th className="px-4 py-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id || index} className="border-t">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{category.name}</td>
                <td className="px-4 py-2 border">{category.description}</td>
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
                          onClick={() => handleEdit(category)}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <UserRoundPen className="mr-2" />
                          Sửa
                        </div>
                        <div
                          onClick={() => handleDelete(category._id)}
                          className="flex items-center px-4 py-2 text-red-500 hover:bg-red-100 cursor-pointer"
                        >
                          <Trash2 className="mr-2" /> Xóa
                        </div>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isEditModalOpen && editCategory && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="rounded-lg w-full max-w-lg">
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
            <div className="rounded-lg w-full max-w-lg">
              <AddMedicineCategory
                onClose={() => setShowCreateForm(false)}
                onAdd={handleAddCategory}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineCategoryTable;
