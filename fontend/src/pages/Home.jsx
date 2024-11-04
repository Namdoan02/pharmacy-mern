import Header from "../components/Header";
import { motion } from "framer-motion";
import StatCard from "../components/StatCard";
import { DollarSign, ShoppingCart, Users, Box } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useContext,useEffect  } from "react";
import { UserContext } from "../../context/usercontext.jsx";
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const { user, setUser  } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    // Kiểm tra token trong localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Gọi API để lấy thông tin người dùng từ token
      fetch('http://localhost:5000/api/auth/profile', {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok'); // Bắt lỗi nếu có sự cố với response
          }
          return response.json();
        })
        .then(data => {
          if (data.profile) { // Kiểm tra trường 'profile' trong dữ liệu trả về
            setUser(data.profile); // Thiết lập người dùng nếu token hợp lệ
          } else {
            // Nếu không có thông tin người dùng hợp lệ, xóa token và điều hướng
            localStorage.removeItem('token');
            navigate('/login'); // Điều hướng đến trang đăng nhập nếu không hợp lệ
          }
        })
        .catch(() => {
          // Nếu có lỗi trong quá trình gọi API, xóa token và điều hướng
          localStorage.removeItem('token');
          navigate('/login'); // Chuyển hướng đến trang đăng nhập nếu có lỗi
        });
    } else {
      navigate('/login'); // Điều hướng đến trang đăng nhập nếu không có token
    }
  }, [setUser, navigate]);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
    setUser(null); // Đặt user thành null
    navigate('/login'); // Điều hướng về trang đăng nhập
  };
  return (
    <div className="flex h-screen bg-gray-500 text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="w-screen h-screen overflow-auto z-10">
      <Header title="Tổng quan" username={user?.name} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-10">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard
              name="Revenue"
              icon={DollarSign}
              value="1,200"
              color="#FFC107"
            />
            <StatCard
              name="Orders"
              icon={ShoppingCart}
              value="150"
              color="#33FFFF"
            />
            <StatCard name="Users" icon={Users} value="265" color="#FF5722" />
            <StatCard name="Products" icon={Box} value="350" color="#4CAF50" />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Home;
