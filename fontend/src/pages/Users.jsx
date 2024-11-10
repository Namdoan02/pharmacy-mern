import { useEffect, useState } from "react";
import CreateUser from "./createUser"; // Import the CreateUser component

function UserTable() {
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/users");
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

  // Filter users based on selected status
  const filteredUsers = users.filter((user) =>
    filterStatus === "All" ? true : user.status.toLowerCase() === filterStatus
  );

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

      <div className="mb-4 grid grid-cols-4 gap-4 text-black">
        <select
          className="border p-2 rounded-lg"
          onChange={(e) => setFilterStatus(e.target.value)}
          value={filterStatus}
        >
          <option value="All">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
      </div>

      <table className="min-w-full bg-gray-600 rounded-lg shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Tên</th>
            <th className="px-4 py-2 text-left">Quyền</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Trạng thái</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="px-4 py-2 flex items-center">
                <input type="checkbox" className="mr-2" />
                <div>{user.name}</div>
              </td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-lg ${
                    user.role === "admin"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full ${
                    user.status.toLowerCase() === "active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.status.toLowerCase() === "active"
                    ? "Hoạt động"
                    : "Không hoạt động"}
                </span>
              </td>
              <td className="px-4 py-2 text-center">
                <button className="text-gray-400 hover:text-gray-600">
                  •••
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for CreateUser form */}
      {showCreateForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 rounded-lg w-full max-w-lg">
            <CreateUser onClose={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTable;
