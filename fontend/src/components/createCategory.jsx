import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddMedicineCategory = ({ onClose }) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: "",
    description: "",
  });

  const handleAdd = async () => {
    if (!category.name || !category.description) {
    toast.error("Vui lòng nhập tên và mô tả!");
      return;
    }

    const newCategory = {
      name: category.name,
      description: category.description,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/categories/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCategory),
        }
      );

      if (response.ok) {
        toast.success("Thêm loại thuốc mới thành công!");
        navigate("/category-medicine"); // Update the category list
        onClose(); 
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Thêm thất bại.");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    toast.error("Đã xảy ra lỗi khi thêm loại thuốc.");
    }
  };
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white mb-4 text-black">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Thêm Loại Thuốc</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold">
          ✕
        </button>
      </div>
      <input
        type="text"
        placeholder="Tên Loại Thuốc"
        className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
        value={category.name}
        onChange={(e) => setCategory({ ...category, name: e.target.value })}
      />
      <textarea
        placeholder="Mô tả chung"
        className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
        value={category.description}
        onChange={(e) =>
          setCategory({ ...category, description: e.target.value })
        }
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
        onClick={handleAdd}
      >
        Thêm Loại Thuốc
      </button>
    </div>
  );
};

export default AddMedicineCategory;
