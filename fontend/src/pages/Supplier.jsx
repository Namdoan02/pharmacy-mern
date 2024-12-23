import { useEffect, useState } from "react";
import AddSupplierForm from "../components/createSupplier";
import EditSupplier from "../components/updateSupplier";
import { Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";

function SupplierTable() {
  const [suppliers, setSuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [suppliersPerPage] = useState(10);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/suppliers/suppliers"
        );
        const data = await response.json();
        setSuppliers(data.data || []);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleEdit = (supplier) => {
    setEditSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedSupplier) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/suppliers/update/${updatedSupplier._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSupplier),
        }
      );

      if (response.ok) {
        toast.success("Cập nhật nhà cung cấp thành công!");
        setSuppliers((prev) =>
          prev.map((s) => (s._id === updatedSupplier._id ? updatedSupplier : s))
        );
        setIsEditModalOpen(false);
      } else {
        toast.error("Cập nhật nhà cung cấp thất bại");
      }
        } catch (error) {
      console.error("Lỗi khi cập nhật nhà cung cấp:", error);
      toast.error("Lỗi khi cập nhật nhà cung cấp");
    }
  };

  const handleDelete = async (supplierId) => {
    const deleteSupplier = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/suppliers/delete/${supplierId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setSuppliers((prev) => prev.filter((s) => s._id !== supplierId));
        toast.success("Xóa nhà cung cấp thành công!");
      } else {
        toast.error("Xóa nhà cung cấp thất bại!");
            }
          } catch (error) {
            console.error("Lỗi khi xóa nhà cung cấp:", error);
            toast.error("Lỗi khi xóa nhà cung cấp");
    }
  };
    toast(
      (t) => (
        <div>
          <p>Bạn có chắc muốn xóa khách hàng này?</p>
          <div className="flex justify-center space-x-2 mt-2">
            <button
              onClick={() => {
                deleteSupplier(); // Perform deletion
                toast.dismiss(t.id); // Close the confirmation toast
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Xác nhận
            </button>
            <button
              onClick={() => toast.dismiss(t.id)} // Close toast without action
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              Hủy
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        duration: 5000,
        closeOnClick: false,
        draggable: false,
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

  const totalPages = Math.ceil(suppliers.length / suppliersPerPage);
  const startIndex = (currentPage - 1) * suppliersPerPage;
  const paginatedSuppliers = suppliers.slice(
    startIndex,
    startIndex + suppliersPerPage
  );

  return (
    <div className="p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Danh sách nhà cung cấp
        </h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Thêm mới
        </button>
      </div>
      <div className="bg-gray-100 p-4 border rounded-lg shadow-md">
        <table className="min-w-full bg-white border rounded-lg shadow-lg text-gray-700">
          <thead>
            <tr className="bg-gray-200 text-gray-800">
              <th className="px-4 py-2 text-left">STT</th>
              <th className="px-4 py-2 text-left">Tên nhà cung cấp</th>
              <th className="px-4 py-2 text-left">Người liên hệ</th>
              <th className="px-4 py-2 text-left">Mã số thuế</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Số điện thoại</th>
              <th className="px-4 py-2 text-left">Địa chỉ</th>
              <th className="px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSuppliers.map((supplier, index) => (
              <tr
                key={supplier._id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2">{startIndex + index + 1}</td>
                <td className="px-4 py-2">{supplier.supplierName}</td>
                <td className="px-4 py-2">{supplier.contactPerson}</td>
                <td className="px-4 py-2">{supplier.taxCode}</td>
                <td className="px-4 py-2">{supplier.email}</td>
                <td className="px-4 py-2">{supplier.phoneNumber}</td>
                <td className="px-4 py-2">{supplier.address}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleEdit(supplier)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(supplier._id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </button>
          <span className="text-gray-700">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {isEditModalOpen && editSupplier && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <EditSupplier
            supplierId={editSupplier._id}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSave}
          />
        </div>
      )}

      {showCreateForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <AddSupplierForm onClose={() => setShowCreateForm(false)} />
        </div>
      )}
    </div>
  );
}

export default SupplierTable;
