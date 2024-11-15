import { useContext, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./index.css";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContextProvider, UserContext } from "../context/usercontext.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Product from "./pages/Product.jsx";
import Register from "./pages/Register.jsx";
import Users from "./pages/Users.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import CreateUser from "./components/createUser.jsx";
import WarehouseEntry from "./pages/Warehouse.jsx";
import Supplier from "./pages/Supplier.jsx";
import EditUser from "./components/updateUser.jsx";

export default function App() {
  return (
    <UserContextProvider>
      <MainLayout />
    </UserContextProvider>
  );
}

function MainLayout() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:5000/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.profile) {
            setUser(data.profile);
          } else {
            localStorage.removeItem("token");
            navigate("/login");
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [setUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  // Check if the current route is "/login"
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex h-screen w-full bg-gray-500 text-gray-100 overflow-hidden">
      {!isLoginPage && <Sidebar />}
      <div className={`flex flex-col ${isLoginPage ? "w-full" : "w-full"}`}>
        {!isLoginPage && (
          <Header userRole={user?.role} username={user?.name} onLogout={handleLogout} />
        )}
        <div className="flex-grow overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product" element={<Product />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/create" element={<CreateUser />} />
            <Route path="/edit/:id" element={<EditUser />} />
            <Route path="/warehouse" element={<WarehouseEntry />} />
            <Route path="/supplier" element={<Supplier/>} />
          </Routes>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
