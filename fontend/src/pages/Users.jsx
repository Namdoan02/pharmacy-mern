import { useEffect, useState } from "react";
import CreateUser from "./CreateUser"; // Import the CreateUser component
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

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

  const handleDelete = async (userId) => {
    const deleteUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/users/${userId}`,
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
              Confirm
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Cancel
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
                      <li
                        onClick={() => console.log("Edit user", user._id)}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <span role="img" aria-label="edit" className="mr-2">
                          ✏️
                        </span>{" "}
                        Edit
                      </li>
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

      {/* Modal for CreateUser form */}
      {showCreateForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="rounded-lg w-full max-w-lg ">
            <CreateUser onClose={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTable;
