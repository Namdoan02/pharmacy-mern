import { useContext, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./index.css";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContextProvider, UserContext } from "../context/usercontext.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import MedicineTable from "./pages/Medicine.jsx";
import Register from "./pages/Register.jsx";
import Users from "./pages/Users.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import CreateUser from "./components/createUser.jsx";
import WarehouseEntry from "./pages/Warehouse.jsx";
import Supplier from "./pages/Supplier.jsx";
import EditUser from "./components/updateUser.jsx";
import EditSupplier from "./components/updateSupplier.jsx";
import AddSupplierForm from "./components/createSupplier.jsx";
import DrugGroup from "./pages/Category.jsx";
import MedicineDetail from "./components/medicineDetail.jsx";
import EditMedicineForm from "./pages/updateMedicine.jsx";
import CustomerTable from "./pages/Customer.jsx";
import ImportMedicineForm from "./components/importMedicine.jsx";
import HistoryImportDrug from "./components/historyMedicine.jsx";
import SellMedicine from "./pages/SellMedicine.jsx";
import OrderPage from "./pages/Order.jsx";
import ReportChart from "./pages/Report.jsx";

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
      fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
    <div className="flex h-screen w-full bg-gray-100 text-gray-800 overflow-hidden">
      {!isLoginPage && <Sidebar />}
      <div className={`flex flex-col ${isLoginPage ? "w-full" : "w-full"}`}>
        {!isLoginPage && (
          <Header userRole={user?.role} username={user?.name} onLogout={handleLogout} />
        )}
        <div className="flex-grow overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/medicines" element={<MedicineTable />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/create" element={<CreateUser />} />
            <Route path="/edit/:id" element={<EditUser />} />
            <Route path="/warehouse" element={<WarehouseEntry />} />
            <Route path="/supplier" element={<Supplier/>} />
            <Route path="/edit/:id" element={<EditSupplier />} />
            <Route path="/supplier/create" element={<AddSupplierForm />} />
            <Route path="/category-medicine" element={<DrugGroup />} />
            <Route path="/medicines/:id" component={<MedicineDetail/>} />
            <Route path="/medicines/update/:id/*" element={<EditMedicineForm />} />
            <Route path="/customers" element={<CustomerTable />} />
            <Route path="import-medicine" element={<ImportMedicineForm />} />
            <Route path="/medicine-history" element={<HistoryImportDrug />} />
            <Route path="/sell-medicine" element={<SellMedicine/>} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/reports" element={<ReportChart />} />
          </Routes>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
