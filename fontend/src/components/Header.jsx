import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ username, userRole, onLogout }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality if needed
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="bg-blue-400 shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex items-center flex-grow mr-6">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M10 2a8 8 0 015.293 13.707l4.607 4.607a1 1 0 01-1.414 1.414l-4.607-4.607A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center space-x-4 text-white font-medium">
          {username && userRole ? (
            <>
             <div
                className={`px-4 py-2 rounded-full text-white font-semibold ${
                  userRole === "admin" ? "bg-red-500" : "bg-blue-500"
                }`}
              >
                {userRole}
              </div>

              {/* Dropdown for Logout */}
              <div className="relative">
                <span
                  onClick={toggleDropdown}
                  className="cursor-pointer flex items-center text-black font-semibold"
                >
                  {username}
                </span>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-24 bg-white rounded shadow-lg z-50">
                    <button
                      // onProfile
                      onClick={onLogout}
                      className="w-full px-2 py-1 text-left text-gray-800 hover:bg-red-500 hover:text-white rounded"
                    >
                      Hồ sơ
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full px-2 py-1 text-left text-gray-800 hover:bg-red-500 hover:text-white rounded"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-blue-500 rounded-full hover:bg-blue-600 text-white"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
