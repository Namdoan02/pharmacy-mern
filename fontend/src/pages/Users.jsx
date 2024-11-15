import { useEffect, useState } from "react";
import CreateUser from "../components/createUser";
import EditUser from "../components/updateUser";
import { Trash2, UserRoundPen } from "lucide-react";
import { toast } from "react-toastify";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/users");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleEdit = (user) => {
    setEditUser(user); // Set the selected user for editing
    setIsEditModalOpen(true); // Open the edit modal
  };

  const handleSave = async (updatedUser) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/update/${updatedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
  
      if (response.ok) {
        toast.success("Người dùng đã được cập nhật thành công!");
  
        // Re-fetch updated user list
        const fetchUsers = async () => {
          try {
            const response = await fetch("http://localhost:5000/api/users/users");
            if (!response.ok) {
              throw new Error("Failed to fetch updated user list");
            }
            const data = await response.json();
            setUsers(data); // Update the user list in state
          } catch (error) {
            console.error("Error fetching updated user list:", error);
          }
        };
  
        await fetchUsers(); // Refresh the user list
        setIsEditModalOpen(false); // Close the modal
      } 
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật người dùng.");
    }
  };

  const handleDelete = async (userId) => {
    const deleteUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/delete/${userId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userId)
          );
          toast.success("Xóa người dùng thành công");
        } else {
          toast.error("Không thể xóa người dùng");
        }
      } catch (error) {
        console.error("Lỗi xóa người dùng:", error);
        toast.error("Đã xảy ra lỗi khi xóa người dùng");
      }
    };

    toast(
      (t) => (
        <div>
          <p>Bạn có chắc muốn xóa người dùng này?</p>
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => {
                deleteUser();
                toast.dismiss(t.id); // Dismiss confirmation toast
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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Danh sách người dùng</h1>
        <button
          onClick={() => setShowCreateForm(true)} // Show the modal
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Thêm mới
        </button>
      </div>

      <table className="min-w-full bg-gray-600 rounded-lg shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">STT</th>
            <th className="px-4 py-2 text-left">Tên</th>
            <th className="px-4 py-2 text-left">Quyền</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Số điện thoại</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id} className="border-t">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-lg  ${
                    user.role === "admin"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.phone}</td>
              <td className="px-4 py-2 text-center relative">
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => toggleDropdown(index)}
                >
                  •••
                </button>
                {activeDropdown === index && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
                    <ul className="py-1 text-gray-700">
                      <div
                        onClick={() => handleEdit(user._id)}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <UserRoundPen className="mr-2" />
                        Sửa
                      </div>
                      <div
                        onClick={() => handleDelete(user._id)}
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
      {isEditModalOpen && editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="rounded-lg w-full max-w-lg">
          <EditUser
            userId={editUser}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSave}
          />
          </div>
        </div>
      )}
      {/* Modal for CreateUser form */}
      {showCreateForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="rounded-lg w-full max-w-lg">
            <CreateUser onClose={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTable;
