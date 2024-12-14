import { useEffect, useState } from "react";
import AddCustomerForm from "../components/createCustomer";
import EditCustomer from "../components/updateCustomer";
import { Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";

function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/customers/customers"
      );
      const data = await response.json();
      console.log("Fetched Customers:", data);
      setCustomers(data.customers || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Không thể tải danh sách khách hàng.");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle Edit Customer
  const handleEdit = (customer) => {
    if (!customer || !customer._id) {
      console.error("Invalid customer data:", customer);
      toast.error("Dữ liệu khách hàng không hợp lệ hoặc thiếu ID!");
      return;
    }
    setEditCustomer(customer);
    setIsEditModalOpen(true);
  };

  // Handle Save Customer
  const handleSave = async (updatedCustomer) => {
    const customerId = updatedCustomer._id || updatedCustomer.data?._id;

    if (!customerId) {
      console.error("Error: Updated customer does not contain a valid ID.");
      toast.error("Dữ liệu khách hàng không hợp lệ hoặc thiếu ID!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/customers/update/${customerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCustomer),
        }
      );

      if (response.ok) {
        toast.success("Khách hàng đã được cập nhật thành công!");
        fetchCustomers(); // Refetch after update
        setIsEditModalOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Không thể cập nhật khách hàng");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật khách hàng.");
    }
  };

  // Handle Delete Customer
  const handleDelete = async (customerId) => {
    const deleteCustomer = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/customers/delete/${customerId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setCustomers((prevCustomers) =>
            prevCustomers.filter((customer) => customer._id !== customerId)
          );
          toast.success("Xóa khách hàng thành công");
        } else {
          throw new Error("Failed to delete customer");
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        toast.error("Đã xảy ra lỗi khi xóa khách hàng");
      }
    };

    toast(
      (t) => (
        <div>
          <p>Bạn có chắc muốn xóa khách hàng này?</p>
          <div className="flex justify-center space-x-2 mt-2">
            <button
              onClick={() => {
                deleteCustomer(); // Perform deletion
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

  // Pagination Logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Danh sách khách hàng</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Tạo mới
        </button>
      </div>
      <div className="bg-slate-100 p-3 border rounded-md shadow-md">
        <table className="min-w-full bg-white border rounded-lg shadow-lg text-black">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left border">STT</th>
              <th className="px-4 py-2 text-left border">Tên khách hàng</th>
              <th className="px-4 py-2 text-left border">Email</th>
              <th className="px-4 py-2 text-left border">Số điện thoại</th>
              <th className="px-4 py-2 text-left border">Giới tính</th>
              <th className="px-4 py-2 text-left border">Ngày sinh</th>
              <th className="px-4 py-2 text-left border">Địa chỉ</th>
              <th className="px-4 py-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer, index) => (
              <tr key={customer._id || index} className="border-t">
                <td className="px-4 py-2 border">
                  {index + 1 + (currentPage - 1) * customersPerPage}
                </td>
                <td className="px-4 py-2 border">{customer.name}</td>
                <td className="px-4 py-2 border">{customer.email}</td>
                <td className="px-4 py-2 border">{customer.phoneNumber}</td>
                <td className="px-4 py-2 border">{customer.gender}</td>
                <td className="px-4 py-2 border">
                  {new Date(customer.birthDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">{customer.address}</td>
                <td className="px-6 py-4 text-center text-gray-800 text-sm border-b">
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      className="text-blue-600 hover:text-blue-800 focus:outline-none"
                      onClick={() => handleEdit(customer)}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                      onClick={() => handleDelete(customer._id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            <ChevronLeft />
          </button>
          <span className="text-gray-700">Trang {currentPage}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage * customersPerPage >= customers.length}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Modal for Editing Customer */}
        {isEditModalOpen && editCustomer && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="rounded-lg w-full max-w-lg bg-white p-6 shadow-lg">
              <EditCustomer
                customer={editCustomer}
                onSave={handleSave}
                onClose={() => setIsEditModalOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Modal for Adding Customer */}
        {showCreateForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="rounded-lg w-full max-w-lg bg-white p-6 shadow-lg">
              <AddCustomerForm
                onClose={() => setShowCreateForm(false)}
                onSave={(newCustomer) => {
                  setCustomers((prev) => [...prev, newCustomer]);
                  setShowCreateForm(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerTable;
