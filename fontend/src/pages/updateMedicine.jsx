import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import ImportMedicineForm from "../components/importMedicine";

const EditMedicineForm = () => {
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
  const [medicineQuantity, setMedicineQuantity] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [showImportForm, setShowImportForm] = useState(false);
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

  // Fetch medicine data by ID
  useEffect(() => {
    if (!id) return;

    const fetchMedicine = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/medicines/medicines/${id}`
        );
        const data = await response.json();
        if (data.data) {
          const medicine = data.data;
          setFormData({
            name: medicine.name || "",
            category: medicine.category?._id || "",
            dosage: medicine.dosage || "",
            usage: medicine.usage || "",
            unit: medicine.unit || "",
            prescription: medicine.prescription || "",
            packaging: medicine.packaging || "",
            sideEffects: medicine.sideEffects || "",
            instructions: medicine.instructions || "",
            description: medicine.description || "",
          });
          setMedicineQuantity(medicine.quantity || 0);
        }
      } catch (error) {
        console.error("Error fetching medicine data:", error);
        toast.error("Không thể lấy thông tin thuốc.");
      }
    };

    fetchMedicine();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.category) {
      toast.error("Tên thuốc và loại thuốc là bắt buộc!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/medicines/update/${id}`,
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

      await response.json();
      toast.success("Thuốc đã được cập nhật thành công!");
      navigate("/medicines");
    } catch (error) {
      console.error("Error updating medicine:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật thuốc.");
    }
  };

  return (
    <div className="bg-gray-500 py-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-4">
          Cập nhật thông tin thuốc
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
          {/* Tên thuốc */}
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-600">
              Tên Thuốc
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Tên Thuốc"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Loại thuốc */}
          <div className="space-y-1">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-600"
            >
              Loại thuốc
            </label>
            {loading ? (
              <div className="text-center">
                Đang tải danh sách loại thuốc...
              </div>
            ) : (
              <select
                name="category"
                id="category"
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="">Không có loại thuốc</option>
                )}
              </select>
            )}
          </div>

          {/* Liều lượng */}
          <div className="space-y-1">
            <label
              htmlFor="dosage"
              className="text-sm font-medium text-gray-600"
            >
              Liều Lượng
            </label>
            <input
              type="text"
              name="dosage"
              id="dosage"
              placeholder="Liều Lượng"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              value={formData.dosage}
              onChange={handleChange}
            />
          </div>

          {/* Công dụng */}
          <div className="space-y-1">
            <label
              htmlFor="usage"
              className="text-sm font-medium text-gray-600"
            >
              Công Dụng
            </label>
            <input
              type="text"
              name="usage"
              id="usage"
              placeholder="Công Dụng"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              value={formData.usage}
              onChange={handleChange}
            />
          </div>

          {/* Đơn vị tính */}
          <div className="space-y-1">
            <label htmlFor="unit" className="text-sm font-medium text-gray-600">
              Đơn vị tính
            </label>
            <select
              id="unit"
              name="unit"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              value={formData.unit}
              onChange={handleChange}
            >
              <option value="Viên">Viên</option>
              <option value="Vỉ">Vỉ</option>
              <option value="Hộp">Hộp</option>
            </select>
          </div>

          {/* Thuốc kê đơn */}
          <div className="space-y-1">
            <label
              htmlFor="prescription"
              className="text-sm font-medium text-gray-600"
            >
              Thuốc kê đơn
            </label>
            <select
              id="prescription"
              name="prescription"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              value={formData.prescription}
              onChange={handleChange}
            >
              <option value="Có">Có</option>
              <option value="Không">Không</option>
            </select>
          </div>

          {/* Quy cách đóng gói */}
          <div className="space-y-1">
            <label
              htmlFor="packaging"
              className="text-sm font-medium text-gray-600"
            >
              Quy cách đóng gói
            </label>
            <input
              name="packaging"
              id="packaging"
              placeholder="Quy cách đóng gói"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              value={formData.packaging}
              onChange={handleChange}
            />
          </div>

          {/* Tác dụng phụ */}
          <div className="space-y-1">
            <label
              htmlFor="sideEffects"
              className="text-sm font-medium text-gray-600"
            >
              Tác dụng phụ
            </label>
            <input
              name="sideEffects"
              id="sideEffects"
              placeholder="Tác dụng phụ"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              value={formData.sideEffects}
              onChange={handleChange}
            />
          </div>

          {/* Số lượng */}
          <div className="space-y-1">
            <label
              htmlFor="quantity"
              className="text-sm font-medium text-gray-600"
            >
              Số lượng
            </label>
            <div className="flex items-center space-x-2">
              <span
                id="quantity"
                className="border border-gray-300 rounded-lg p-2 w-full text-center bg-gray-100 cursor-not-allowed"
              >
               {medicineQuantity}
              </span>
            </div>
          </div>

          {/* Hướng dẫn sử dụng */}
          <div className="col-span-3">
            <label
              htmlFor="instructions"
              className="text-sm font-medium text-gray-600"
            >
              Hướng dẫn sử dụng
            </label>
            <textarea
              name="instructions"
              id="instructions"
              placeholder="Hướng dẫn sử dụng"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              value={formData.instructions}
              onChange={handleChange}
            />
          </div>

          {/* Mô tả */}
          <div className="col-span-3">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-600"
            >
              Mô tả
            </label>
            <textarea
              name="description"
              id="description"
              placeholder="Mô tả"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Các nút bổ sung */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Nút Cập nhật thuốc */}
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 w-full"
          >
            Cập nhật Thuốc
          </button>

          {/* Nút Hủy */}
          <button
            onClick={() => navigate("/medicines")} // Chuyển hướng về trang danh sách thuốc
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 w-full"
          >
            Hủy
          </button>

          {/* Nút Nhập thuốc */}
          <div className="mt-6 sm:mt-0">
            <button
              onClick={() => setShowImportForm(true)}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 w-full"
            >
              Nhập Thuốc
            </button>
          </div>

          {/* Nút Xem lịch sử nhập thuốc */}
          <button
            onClick={() => navigate("/medicine-history")} // Chuyển hướng đến trang lịch sử nhập thuốc
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 w-full"
          >
            Xem Lịch Sử Nhập Thuốc
          </button>
        </div>

        {showImportForm && (
          <div className="mt-8">
            <ImportMedicineForm onClose={() => setShowImportForm(false)} medicineId={id}
              setMedicineQuantity={setMedicineQuantity}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditMedicineForm;
