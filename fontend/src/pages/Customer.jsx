import { useEffect, useState, useRef } from "react";
import AddCustomerForm from "../components/createCustomer";
import EditCustomer from "../components/updateCustomer";
import { Trash2, Edit } from "lucide-react";
import { toast } from "react-toastify";

function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const dropdownRef = useRef(null); // Ref to track the dropdown
  const buttonRef = useRef(null); // Ref to track the button

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/customers/customers"
        );
        const data = await response.json();
        console.log("Fetched Customers:", data); // Debug the API response
        setCustomers(data.customers || []); // Fallback to an empty array if data is undefined
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Không thể tải danh sách khách hàng.");
      }
    };

    fetchCustomers();

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

  const handleEdit = (customer) => {
    if (!customer || !customer._id) {
      console.error("Invalid customer data:", customer);
      toast.error("Dữ liệu khách hàng không hợp lệ hoặc thiếu ID!");
      return;
    }

    // Log customer object for debugging
    console.log("Editing customer:", customer);

    // Set customer for editing
    setEditCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedCustomer) => {
    const customerId = updatedCustomer._id || updatedCustomer.data?._id;

    if (!customerId) {
      console.error(
        "Error: Updated customer does not contain a valid ID.",
        updatedCustomer
      );
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

        const fetchCustomers = async () => {
          try {
            const response = await fetch(
              "http://localhost:5000/api/customers/customers"
            );
            if (!response.ok) {
              throw new Error("Failed to fetch updated customer list");
            }
            const data = await response.json();
            setCustomers(data.customers || []); // Cập nhật danh sách khách hàng vào state
            console.log("Updated customer list:", data.customers); // Log danh sách để kiểm tra
          } catch (error) {
            console.error("Error fetching updated customer list:", error);
            toast.error("Không thể tải danh sách khách hàng.");
          }
        };
        // Fetch updated customer list
        await fetchCustomers();

        // Close the modal after successful update
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
          toast.success("Xóa khách hàng thành công", {
            autoClose: 5000, // Tự động đóng sau 5 giây
          });
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Không thể xóa khách hàng.", {
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        toast.error("Đã xảy ra lỗi khi xóa khách hàng.", {
          autoClose: 5000,
        });
      }
    };

    toast(
      (t) => (
        <div>
          <p>Bạn có chắc muốn xóa khách hàng này?</p>
          <div className="flex justify-center space-x-2 mt-2">
            <button
              onClick={() => {
                deleteCustomer(); // Thực hiện xóa
                toast.dismiss(t.id); // Đóng thông báo xác nhận
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Xác nhận
            </button>
            <button
              onClick={() => toast.dismiss(t.id)} // Đóng thông báo xác nhận
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              Hủy
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center", // Hiển thị ở giữa trên cùng
        autoClose: false, // Không tự động đóng
        closeOnClick: false, // Không đóng khi nhấn
        draggable: false, // Không cho phép kéo toast
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
      <div className="bg-slate-300 p-3 border rounded-md">
        <table className="min-w-full bg-white border rounded-lg shadow-lg text-black">
          <thead>
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
            {customers.map((customer, index) => (
              <tr key={customer._id || index} className="border-t">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{customer.name}</td>
                <td className="px-4 py-2 border">{customer.email}</td>
                <td className="px-4 py-2 border">{customer.phoneNumber}</td>
                <td className="px-4 py-2 border">{customer.gender}</td>
                <td className="px-4 py-2 border">
                  {new Date(customer.birthDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">{customer.address}</td>
                <td className="px-4 py-2 text-center relative">
                  <button
                    ref={buttonRef}
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => toggleDropdown(index)}
                  >
                    •••
                  </button>
                  {activeDropdown === index && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
                      <ul className="py-1 text-gray-700">
                        <div
                          ref={dropdownRef}
                          onClick={() => handleEdit(customer)}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <Edit className="mr-2" />
                          Sửa
                        </div>
                        <div
                        ref={dropdownRef}
                          onClick={() => handleDelete(customer._id)}
                          className="flex items-center px-4 py-2 text-red-500 hover:bg-red-100 cursor-pointer"
                        >
                          <Trash2 className="mr-2" /> Xoá
                        </div>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Sửa Khách Hàng */}
        {isEditModalOpen && editCustomer && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="rounded-lg w-full max-w-lg bg-white p-6 shadow-lg">
              <EditCustomer
                customer={editCustomer}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
              />
            </div>
          </div>
        )}

        {/* Modal Thêm Khách Hàng */}
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
