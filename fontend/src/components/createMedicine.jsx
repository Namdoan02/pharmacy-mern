import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AddMedicineForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "", // Chứa ID của loại thuốc
    dosage: "",
    usage: "",
    unit: "",
    prescription: "",
    packaging: "",
    sideEffects: "",
    instructions: "",
    description: "",
  });

  const [categories, setCategories] = useState([]); // Danh sách loại thuốc
  const [loading, setLoading] = useState(true);

  // Fetch danh sách loại thuốc từ API
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
          toast.error(
            errorData.message || "Không thể tải danh sách loại thuốc."
          );
          return;
        }

        const data = await response.json();
        console.log("Fetched Categories:", data); // Debug dữ liệu trả về
        setCategories(data.data || []); // Đảm bảo rằng categories chứa mảng các loại thuốc
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Không thể tải danh sách loại thuốc.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.category) {
      toast.error("Vui lòng nhập tên thuốc và chọn loại thuốc!");
      return;
    }

    try {
      // Check if the medicine already exists
      const existingMedicineResponse = await fetch(
        `http://localhost:5000/api/medicines/check-exists?name=${formData.name}`
      );
      const existingMedicineData = await existingMedicineResponse.json();

      if (existingMedicineData.exists) {
        toast.error("Tên thuốc đã tồn tại. Vui lòng chọn tên khác.");
        return;
      }

      // Create a new medicine
      const response = await fetch(
        "http://localhost:5000/api/medicines/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Thêm thuốc mới thành công!");
        onClose();
      } else {
        toast.error(data.message || "Thêm thuốc thất bại.");
      }
    } catch (error) {
      console.error("Error adding medicine:", error);
      toast.error("Đã xảy ra lỗi khi thêm thuốc.");
    }
  };

  return (
    <div className="rounded-lg bg-white text-black">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Thêm Thuốc</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 font-bold"
        >
          ✕
        </button>
      </div>
      {/* Tên thuốc */}
      <input
        type="text"
        name="name"
        placeholder="Tên Thuốc"
        className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
        value={formData.name}
        onChange={handleChange}
      />

      {/* Loại thuốc */}
      {loading ? (
        <p>Đang tải danh sách loại thuốc...</p>
      ) : (
        <div className="flex-auto">
         <label htmlFor="category" className="text-sm text-gray-600">
         Chọn loại thuốc
          </label>
        <select
          name="category"
          className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
          value={formData.category}
          onChange={handleChange}
        >
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name} {/* Hiển thị tên loại thuốc */}
            </option>
          ))}
        </select></div>
      )}

      {/* Các trường khác */}
      <input
        type="text"
        name="dosage"
        placeholder="Liều Lượng"
        className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
        value={formData.dosage}
        onChange={handleChange}
      />
      <input
        type="text"
        name="usage"
        placeholder="Công Dụng"
        className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
        value={formData.usage}
        onChange={handleChange}
      />
      <div className="flex horizontal mb-2">
        {/* Đơn vị tính */}
        <div className="mr-2 w-full">
          <label htmlFor="unit" className="text-sm text-gray-600">
            Đơn vị tính
          </label>
          <select
            id="unit"
            name="unit"
            className="border border-gray-300 rounded-lg p-2 w-full"
            value={formData.unit}
            onChange={handleChange}
          >
            <option value="Viên">Viên</option>
            <option value="Vỉ">Vỉ</option>
            <option value="Hộp">Hộp</option>
          </select>
        </div>

        {/* Thuốc kê đơn */}
        <div className="w-full">
          <label htmlFor="prescription" className="text-sm text-gray-600">
            Thuốc kê đơn
          </label>
          <select
            id="prescription"
            name="prescription"
            className="border border-gray-300 rounded-lg p-2 w-full"
            value={formData.prescription}
            onChange={handleChange}
          >
            <option value="Có">Có</option>
            <option value="Không">Không</option>
          </select>
        </div>
      </div>

      <input
        name="packaging"
        placeholder="Quy cách đóng gói"
        className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
        value={formData.packaging}
        onChange={handleChange}
      />
      <input
        name="sideEffects"
        placeholder="Tác dụng phụ"
        className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
        value={formData.sideEffects}
        onChange={handleChange}
      />
      <textarea
        name="instructions"
        placeholder="Hướng dẫn sử dụng"
        className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
        value={formData.instructions}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Mô tả"
        className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
        value={formData.description}
        onChange={handleChange}
      />
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
      >
        Thêm Thuốc
      </button>
    </div>
  );
};

export default AddMedicineForm;
