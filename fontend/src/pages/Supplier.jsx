import { useEffect, useState, useRef } from "react";
import AddSupplierForm from "../components/createSupplier";
import EditSupplier from "../components/updateSupplier";
import { Trash2, Edit } from "lucide-react";
import { toast } from "react-toastify";

function SupplierTable() {
  const [suppliers, setSuppliers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const dropdownRef = useRef(null); // Ref to track the dropdown
  const buttonRef = useRef(null); // Ref to track the button
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/suppliers/suppliers"
        );
        const data = await response.json();
        console.log("Fetched Suppliers:", data); // Debug the API response
        setSuppliers(data.data || []); // Fallback to an empty array if data is undefined
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();

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

  const handleEdit = (supplier) => {
    if (!supplier || !supplier._id) {
      console.error("Invalid supplier data:", supplier);
      toast.error("Dữ liệu nhà cung cấp không hợp lệ hoặc thiếu ID!");
      return;
    }

    // Log supplier object for debugging
    console.log("Editing supplier:", supplier);

    // Set supplier for editing
    setEditSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedSupplier) => {
    const supplierId = updatedSupplier._id || updatedSupplier.data?._id;

    if (!supplierId) {
      console.error(
        "Error: Updated supplier does not contain a valid ID.",
        updatedSupplier
      );
      toast.error("Dữ liệu nhà cung cấp không hợp lệ hoặc thiếu ID!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/suppliers/update/${supplierId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedSupplier),
        }
      );

      if (response.ok) {
        toast.success("Nhà cung cấp đã được cập nhật thành công!");

        const fetchSuppliers = async () => {
          try {
            const response = await fetch(
              "http://localhost:5000/api/suppliers/suppliers"
            );
            if (!response.ok) {
              throw new Error("Failed to fetch updated supplier list");
            }
            const data = await response.json();
            setSuppliers(data.data || []); // Cập nhật danh sách nhà cung cấp vào state
            console.log("Updated supplier list:", data.data); // Log danh sách để kiểm tra
          } catch (error) {
            console.error("Error fetching updated supplier list:", error);
            toast.error("Không thể tải danh sách nhà cung cấp.");
          }
        };
        // Fetch updated supplier list
        await fetchSuppliers();

        // Close the modal after successful update
        setIsEditModalOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Không thể cập nhật nhà cung cấp");
      }
    } catch (error) {
      console.error("Error updating supplier:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật nhà cung cấp.");
    }
  };

  const handleDelete = async (supplierId) => {
    const deleteSupplier = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/suppliers/delete/${supplierId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setSuppliers((prevSuppliers) =>
            prevSuppliers.filter((supplier) => supplier._id !== supplierId)
          );
          toast.success("Xóa nhà cung cấp thành công");
        } else {
          throw new Error("Failed to delete supplier");
        }
      } catch (error) {
        console.error("Error deleting supplier:", error);
        toast.error("Đã xảy ra lỗi khi xóa nhà cung cấp");
      }
    };

    toast(
      (t) => (
        <div>
          <p>Bạn có chắc muốn xóa nhà cung cấp này?</p>
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => {
                deleteSupplier();
                toast.dismiss(t.id);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Xác nhận
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Hủy
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center", // Center the toast
        duration: 5000,
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
        <h1 className="text-2xl font-semibold">Danh sách nhà cung cấp</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Tạo mới
        </button>
      </div>
      <div className="bg-slate-300 full-h-screen p-3 border rounded-md">
        <table className="min-w-full bg-white border rounded-lg shadow-lg text-black">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border">STT</th>
              <th className="px-4 py-2 text-left border">Tên nhà cung cấp</th>
              <th className="px-4 py-2 text-left border">Người liên hệ</th>
              <th className="px-4 py-2 text-left border">Mã số thuế</th>
              <th className="px-4 py-2 text-left border">Email</th>
              <th className="px-4 py-2 text-left border">Số điện thoại</th>
              <th className="px-4 py-2 text-left border">Địa chỉ</th>
              <th className="px-4 py-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr key={supplier._id || index} className="border-t">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{supplier.supplierName}</td>
                <td className="px-4 py-2 border">{supplier.contactPerson}</td>
                <td className="px-4 py-2 border">{supplier.taxCode}</td>
                <td className="px-4 py-2 border">{supplier.email}</td>
                <td className="px-4 py-2 border">{supplier.phoneNumber}</td>
                <td className="px-4 py-2 border">{supplier.address}</td>
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
                          onClick={() => handleEdit(supplier)}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <Edit className="mr-2" />
                          Sửa
                        </div>
                        <div
                          onClick={() => handleDelete(supplier._id)}
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

        {isEditModalOpen && editSupplier && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="rounded-lg w-full max-w-lg">
              <EditSupplier
                supplierId={editSupplier._id}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
              />
            </div>
          </div>
        )}

        {showCreateForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="rounded-lg w-full max-w-lg">
              <AddSupplierForm onClose={() => setShowCreateForm(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SupplierTable;
