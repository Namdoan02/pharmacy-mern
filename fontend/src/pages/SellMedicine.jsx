import { useState } from "react";
import { toast } from "react-toastify";
import { Search } from "lucide-react";
import PrescriptionInvoice from "../components/PrescriptionInvoice";
import NonPrescriptionInvoice from "../components/NonPrescriptionInvoice";
import InvoicePrint from "../components/InvoicePrint";

const SellMedicine = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Tìm kiếm
  const [filteredMedicines, setFilteredMedicines] = useState([]); // Danh sách thuốc
  const [cart, setCart] = useState([]); // Danh sách mua
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPrescription, setShowPrescription] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phoneNumber: "",
    hospitalName: "",
    medicalCode: "",
  });
  const [savedInvoice, setSavedInvoice] = useState(null);

  // Gọi API tìm kiếm thuốc
  const fetchMedicines = async (keyword) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/medicines/search?keyword=${keyword}`
      );
      const data = await response.json();

      if (response.ok) {
        setFilteredMedicines(
          data.data.map((medicine) => ({
            _id: medicine._id,
            name: medicine.name,
            unit: medicine.unit || "Không xác định",
            quantity: medicine.quantity,
            tempQuantity: medicine.quantity,
            price: medicine.price,
          }))
        );
        setError(null);
      } else {
        setFilteredMedicines([]);
        setError(data.message || "Không tìm thấy thuốc.");
      }
    } catch (err) {
      console.error("Error fetching medicines:", err);
      setError("Lỗi kết nối với server.");
    } finally {
      setLoading(false);
    }
  };

  // Lấy thông tin nhập thuốc gần nhất
  const fetchLatestImport = async (medicineId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/medicines/medicines/${medicineId}`
      );
      const data = await response.json();

      if (response.ok && data.data.importDetails.length > 0) {
        const latestImport = data.data.importDetails.slice(-1)[0];
        return latestImport.retailPrice || 0; // Giá bán lẻ từ nhập gần nhất
      }
    } catch (err) {
      console.error("Error fetching latest import:", err);
    }
    return 0; // Trả về 0 nếu không có dữ liệu
  };

  // Thêm thuốc vào giỏ hàng
  const addToCart = async (medicine) => {
    if (medicine.tempQuantity <= 0) {
      toast.error("Số lượng thuốc không đủ để bán.");
      return;
    }

    // Lấy giá bán lẻ từ thông tin nhập gần nhất
    const retailPrice = await fetchLatestImport(medicine._id);

    const existingItem = cart.find((item) => item._id === medicine._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === medicine._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...medicine,
          quantity: 1,
          price: retailPrice || medicine.price,
        },
      ]);
    }

    // Giảm số lượng tạm thời
    setFilteredMedicines(
      filteredMedicines.map((item) =>
        item._id === medicine._id
          ? { ...item, tempQuantity: item.tempQuantity - 1 }
          : item
      )
    );
  };

  // Tăng số lượng thuốc trong giỏ hàng
  const increaseQuantity = (medicine) => {
    setCart(
      cart.map((item) =>
        item._id === medicine._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
    setFilteredMedicines(
      filteredMedicines.map((item) =>
        item._id === medicine._id
          ? { ...item, tempQuantity: item.tempQuantity - 1 }
          : item
      )
    );
  };

  // Giảm số lượng thuốc trong giỏ hàng
  const decreaseQuantity = (medicine) => {
    if (medicine.quantity === 1) {
      removeFromCart(medicine);
      return;
    }

    setCart(
      cart.map((item) =>
        item._id === medicine._id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );

    setFilteredMedicines(
      filteredMedicines.map((item) =>
        item._id === medicine._id
          ? { ...item, tempQuantity: item.tempQuantity + 1 }
          : item
      )
    );
  };

  // Xóa thuốc khỏi giỏ hàng
  const removeFromCart = (medicine) => {
    setCart(cart.filter((item) => item._id !== medicine._id));
    setFilteredMedicines(
      filteredMedicines.map((item) =>
        item._id === medicine._id
          ? { ...item, tempQuantity: item.tempQuantity + medicine.quantity }
          : item
      )
    );
  };

  // Tính tổng tiền
  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity * 1.05, 0);
  const updateStock = async (medicineId, soldQuantity) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/medicines/reduce-stock/${medicineId}`,
        {
          method: "PUT", // Use PUT as per your backend route
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: soldQuantity }), // Send the quantity sold
        }
      );

      const result = await response.json();
      if (!response.ok) {
        console.error(
          `Error updating stock for medicine ${medicineId}:`,
          result.message
        );
      } else {
        console.log(`Stock updated successfully for medicine ${medicineId}`);
      }
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };
  // Lưu hóa đơn
  const saveInvoice = async () => {
    if (
      showPrescription &&
      (!customerInfo.hospitalName || !customerInfo.medicalCode)
    ) {
      toast.error(
        "Vui lòng cung cấp đầy đủ thông tin bệnh viện và mã phiếu khám."
      );
      return; // Dừng lại nếu thiếu thông tin
    }
    const invoiceData = {
      customerName: customerInfo.name,
      phoneNumber: customerInfo.phoneNumber,
      medicines: cart.map((item) => ({
        medicineId: item._id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        total: item.price * item.quantity,
      })),
      totalAmount: calculateTotal(),
      hospital: showPrescription
        ? {
            place: customerInfo.hospitalName,
            medicalCode: customerInfo.medicalCode,
          }
        : undefined,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/invoices/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(invoiceData), // Gửi data dưới dạng JSON
        }
      );
      console.log("Dữ liệu gửi lên API:", JSON.stringify(invoiceData, null, 2));
      const result = await response.json();
      if (response.ok) {
        toast.success("Hóa đơn đã được tạo thành công!");
        setSavedInvoice({ ...result.data, createdAt: result.data.createdAt });
        setCart([]); // Clear the cart

        // Update stock for each medicine
        for (const item of cart) {
          await updateStock(item._id, item.quantity);
        }

        // Optionally refetch medicines to reflect updated stock
        fetchMedicines(searchTerm);
      } else {
        toast.error(result.message || "Lỗi khi lưu hóa đơn.");
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Lỗi kết nối đến server.");
    }
  };
  return (
    <div className="container mx-auto p-6 bg-gray-100">
      {/* Switch giữa hóa đơn kê đơn và không kê đơn */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setShowPrescription(true)}
          className={`px-4 py-2 rounded ${
            showPrescription ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Lập hóa đơn kê đơn
        </button>
        <button
          onClick={() => setShowPrescription(false)}
          className={`px-4 py-2 rounded ${
            !showPrescription ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
        >
          Lập hóa đơn không kê đơn
        </button>
      </div>

      {showPrescription ? (
        <PrescriptionInvoice setCustomerInfo={setCustomerInfo} />
      ) : (
        <NonPrescriptionInvoice setCustomerInfo={setCustomerInfo} />
      )}

      {/* Input tìm kiếm thuốc */}
      <div className="flex gap-4 items-center mb-4 mt-2">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Nhập tên hoặc công dụng của thuốc..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        <button
          onClick={() => fetchMedicines(searchTerm)}
          className="absolute top-0 right-0 h-full px-4 text-black rounded-md"
        >
          <Search size={20} />
        </button></div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">Tất cả</option>
          <option value="prescription">Thuốc kê đơn</option>
          <option value="non-prescription">Thuốc không kê đơn</option>
        </select>
      </div>
      

      {/* Hiển thị kết quả tìm kiếm */}
      {loading && <p>Đang tìm kiếm...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div>
        {filteredMedicines.map((medicine) => (
          <button
            key={medicine._id}
            onClick={() => addToCart(medicine)}
            className="flex justify-between items-center p-2 border-b w-full hover:bg-gray-300 cursor-pointer rounded-md"
          >
            <span>{medicine.name}</span>
            <span>Số lượng tồn: {medicine.tempQuantity}</span>
          </button>
        ))}
      </div>

      {/* Bảng danh sách thuốc đã chọn */}
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Danh sách thuốc đã chọn</h3>
        <table className="w-full border text-center">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">STT</th>
              <th className="p-2 border">Tên thuốc</th>
              <th className="p-2 border">Số lượng</th>
              <th className="p-2 border">Đơn vị tính</th>
              <th className="p-2 border">Giá bán</th>
              <th className="p-2 border">Thành tiền</th>
              <th className="p-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={item._id}>
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">
                  {item.quantity}
                  
                </td>
                <td className="p-2 border">{item.unit}</td>
                <td className="p-2 border">
                  {item.price.toLocaleString("vi-VN")} ₫
                </td>
                <td className="p-2 border">
                  {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                </td>
                <td className="p-2 border">
                <button
                    onClick={() => increaseQuantity(item)}
                    className="bg-blue-500 text-white px-2 py-1 ml-2 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => decreaseQuantity(item)}
                    className="bg-yellow-500 text-white px-2 py-1 ml-2 rounded"
                  >
                    -
                  </button>
                  <button
                    onClick={() => removeFromCart(item)}
                    className="bg-red-500 text-white px-2 py-1 ml-2 rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tạo hóa đơn và tính tổng tiền */}
        <div className="mt-4 flex justify-between">
          {/* Button */}
          <button
            onClick={saveInvoice}
            className="bg-green-500 px-4 py-2 text-md rounded-md hover:bg-green-600"
          >
            Tạo hóa đơn
          </button>
          {/* Nếu có hóa đơn đã lưu */}
          {savedInvoice && (
            <div>
              <InvoicePrint savedInvoice={savedInvoice} />
            </div>
          )}
          {/* Tổng tiền */}
          <div className="text-right">
            <p className="font-bold">
              Tổng tiền: {calculateTotal().toLocaleString("vi-VN")} ₫
            </p>
            <p className="text-sm font-sans">(Đã bao gồm VAT)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellMedicine;
