import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditMedicineForm = ({ medicine, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    dosage: "",
    usage: "",
    unit: "",
    prescription: "",
    packaging: "",
    sideEffects: "",
    instructions: "",
    description: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const medicineId = medicine._id
  
  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/categories/categories"
        );
        const data = await response.json();
        setCategories(data.data); // Assuming response data has a 'data' field for categories
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Không thể tải danh sách loại thuốc.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch medicine data by ID when the component mounts or when `medicineId` changes
  useEffect(() => {
    if (!medicineId) return; // Don't do anything if no medicineId
    
    const fetchMedicine = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/medicines/medicines/${medicineId}`
        );
        const data = await response.json();
        console.log(data);
        
        if (data.data) {
          const medicine = data.data;
          setFormData({
            name: medicine.name || "",
            category: medicine.category?._id || "", // Use the category ID
            dosage: medicine.dosage || "",
            usage: medicine.usage || "",
            unit: medicine.unit || "",
            prescription: medicine.prescription || "",
            packaging: medicine.packaging || "",
            sideEffects: medicine.sideEffects || "",
            instructions: medicine.instructions || "",
            description: medicine.description || "",
          });
        }
      } catch (error) {
        console.error("Error fetching medicine data:", error);
        toast.error("Không thể lấy thông tin thuốc.");
      }
    };

    fetchMedicine();
  }, [medicineId]); // This effect will re-run when `medicineId` changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(formData);
    
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.category) {
      toast.error("Tên thuốc và loại thuốc là bắt buộc!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/medicines/update/${medicineId}`, // Using medicineId for updating
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Không thể cập nhật thuốc.");
        return;
      }

      const updatedMedicine = await response.json();
      toast.success("Thuốc đã được cập nhật thành công!");
      onSave(updatedMedicine); // Notify parent about the update
    } catch (error) {
      console.error("Error updating medicine:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật thuốc.");
    }
  };

  return (
    <div className="flex-auto text-black min-h-screen grow">
      {/* Main Content Section */}
      <div className="bg-white p-6 rounded-lg item content-between flex flex-col grow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Cập nhật thông tin thuốc
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form Layout */}
        <div className="gap-6 text-black">
          {/* Tên thuốc */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Tên Thuốc"
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Loại thuốc */}
          <div className="flex flex-col">
            <label htmlFor="category" className="text-sm text-gray-600">
              Chọn loại thuốc
            </label>
            {loading ? (
              <p>Đang tải danh sách loại thuốc...</p>
            ) : (
              <select
                name="category"
                className="border border-gray-300 rounded-lg p-2 w-full"
                value={formData.category}
                onChange={handleChange}
              >
                {/* Kiểm tra nếu categories có dữ liệu thì mới render */}
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name} {/* Hiển thị tên loại thuốc */}
                    </option>
                  ))
                ) : (
                  <option value="">Không có loại thuốc</option> // Nếu không có dữ liệu, hiển thị một thông báo
                )}
              </select>
            )}
          </div>

          {/* Liều lượng */}
          <div className="flex flex-col my-1">
            <input
              type="text"
              name="dosage"
              placeholder="Liều Lượng"
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={formData.dosage}
              onChange={handleChange}
            />
          </div>

          {/* Công dụng */}
          <div>
            <input
              type="text"
              name="usage"
              placeholder="Công Dụng"
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={formData.usage}
              onChange={handleChange}
            />
          </div>

          {/* Đơn vị tính */}
          <div>
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
          <div className="my-1">
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

          {/* Quy cách đóng gói */}
          <div className="col-span-2 my-1">
            <input
              name="packaging"
              placeholder="Quy cách đóng gói"
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={formData.packaging}
              onChange={handleChange}
            />
          </div>

          {/* Tác dụng phụ */}
          <div className="col-span-2 my-1">
            <input
              name="sideEffects"
              placeholder="Tác dụng phụ"
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={formData.sideEffects}
              onChange={handleChange}
            />
          </div>

          {/* Hướng dẫn sử dụng */}
          <div className="col-span-2">
            <textarea
              name="instructions"
              placeholder="Hướng dẫn sử dụng"
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={formData.instructions}
              onChange={handleChange}
            />
          </div>

          {/* Mô tả */}
          <div className="col-span-2">
            <textarea
              name="description"
              placeholder="Mô tả"
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Cập nhật Thuốc Button */}
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 w-full mt-6"
        >
          Cập nhật Thuốc
        </button>
      </div>
    </div>
  );
};

export default EditMedicineForm;
