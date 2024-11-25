import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditMedicineCategory = ({ category, onSave, onClose }) => {
  const [editedCategory, setEditedCategory] = useState({
    name: "",
    description: "",
  });

  // Update the state when the `category` prop changes
  useEffect(() => {
    if (category) {
      setEditedCategory({
        name: category.name || "",
        description: category.description || "",
      });
    }
  }, [category]);

  const handleSave = async () => {
    // Validation
    if (!editedCategory.name || !editedCategory.description) {
      toast.error("Tên và mô tả là bắt buộc!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/categories/update/${category._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedCategory),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Không thể cập nhật loại thuốc.");
        return;
      }

      const updatedCategory = await response.json();
      toast.success("Loại thuốc đã được cập nhật thành công!");
      onSave(updatedCategory); // Notify parent about the update
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật loại thuốc.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Sửa Loại Thuốc</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Tên Loại Thuốc
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
            value={editedCategory.name}
            onChange={(e) =>
              setEditedCategory({ ...editedCategory, name: e.target.value })
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Mô tả</label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2"
            rows="4"
            value={editedCategory.description}
            onChange={(e) =>
              setEditedCategory({
                ...editedCategory,
                description: e.target.value,
              })
            }
          ></textarea>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            onClick={handleSave}
          >
            Lưu
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMedicineCategory;
