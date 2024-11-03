import { Routes, Route } from "react-router-dom";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "../context/usercontext.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Product from "./pages/Product.jsx";
import Register from "./pages/Register.jsx";

//import Navbar from "./components/Navbar.jsx";

export default function App() {
  return (
    <UserContextProvider>
      <div className="flex h-screen w-full text-gray-100 overflow-hidden">
        {/* <div className="fixed-inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-600 to-gray-800"></div>
          <div className="absolute inset-0 backdrop-blur-sm"></div>
        </div> */}
        <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product" element={<Product />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </UserContextProvider>
  );
}
