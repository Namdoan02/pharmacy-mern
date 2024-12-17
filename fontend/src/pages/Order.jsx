import { useState, useEffect,useRef  } from "react";
import { toast } from "react-toastify";

const OrderPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleInvoiceId, setVisibleInvoiceId] = useState(null); // Trạng thái để hiển thị chi tiết thuốc của mỗi hóa đơn
  const toastShown  = useRef(false);
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/invoices/invoices"
        );

        if (!response.ok) {
          throw new Error("Không thể tải danh sách hóa đơn.");
        }

        const data = await response.json();
        setInvoices(data.data);
        if (!toastShown.current) {
            toast.success("Tải danh sách hóa đơn thành công!");
            toastShown.current = true; // Đánh dấu là toast đã được hiển thị
          }
      } catch {
        setError("Lỗi khi tải dữ liệu hóa đơn.");
        toast.error("Không thể tải danh sách hóa đơn.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [toastShown]);

  // Hàm để hiển thị danh sách thuốc dưới dạng bảng
  const renderMedicines = (medicines) => {
    return (
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border px-4 py-2">Tên Thuốc</th>
            <th className="border px-4 py-2">Số Lượng</th>
            <th className="border px-4 py-2">Đơn Vị</th>
            <th className="border px-4 py-2">Kê Đơn</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((med, index) => (
            <tr key={index} className="border-b">
              <td className="border px-4 py-2">{med.name}</td>
              <td className="border px-4 py-2">{med.quantity}</td>
              <td className="border px-4 py-2">{med.unit}</td>
              <td className="border px-4 py-2">
                {med.isPrescription ? "Thuốc kê đơn" : "Thuốc không kê đơn"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Hàm xử lý sự kiện nhấn "Xem" để toggle hiển thị thông tin thuốc
  const toggleVisibility = (invoiceId) => {
    setVisibleInvoiceId((prevId) => (prevId === invoiceId ? null : invoiceId));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Danh sách Hóa Đơn</h1>

      {loading ? (
        <div className="text-center text-lg">Đang tải...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : invoices.length === 0 ? (
        <div className="text-center text-lg">Không có hóa đơn nào.</div>
      ) : (
        <div>
          <table className="min-w-full table-auto border-collapse mb-6">
            <thead>
              <tr className="bg-green-500 text-white">
                <th className="border px-4 py-2">Mã Hóa Đơn</th>
                <th className="border px-4 py-2">Tên Khách Hàng</th>
                <th className="border px-4 py-2">Số Điện Thoại</th>
                <th className="border px-4 py-2">Tổng Tiền</th>
                <th className="border px-4 py-2">Ngày Tạo</th>
                <th className="border px-4 py-2">Danh Sách Thuốc</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id} className="border-b">
                  <td className="border px-4 py-2">{invoice._id}</td>
                  <td className="border px-4 py-2">{invoice.customerName}</td>
                  <td className="border px-4 py-2">{invoice.phoneNumber}</td>
                  <td className="border px-4 py-2">
                    {invoice.totalAmount.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(invoice.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => toggleVisibility(invoice._id)}
                      className="text-blue-500 hover:underline"
                    >
                      {visibleInvoiceId === invoice._id ? "Ẩn" : "Xem"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Hiển thị thông tin thuốc khi nút "Xem" được nhấn */}
          {invoices.map(
            (invoice) =>
              visibleInvoiceId === invoice._id && (
                <div key={invoice._id} className="mb-6">
                  <h2 className="text-2xl font-bold mb-4">
                    Chi Tiết Thuốc Hóa Đơn {invoice._id}
                  </h2>
                  <div className="space-y-4">
                    {renderMedicines(invoice.medicines)}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
