import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto"; // Import tự động của Chart.js
import StatCard from "../components/StatCard";
import { DollarSign, ShoppingCart, Box } from "lucide-react";

const Home = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  useEffect(() => {
    // Fetch dữ liệu từ API
    const fetchRevenueData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/invoices/statistics/total-revenue"
        );
        const data = await response.json();
        console.log("Fetched Data:", data); // Debug dữ liệu từ API
        setTotalRevenue(data.totalRevenue || 0); // Gán tổng doanh thu
        setLoading(false);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);
  const getLastMonths = (count) => {
    const now = new Date();
    const months = [];
    for (let i = 0; i < count; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i);
      months.unshift(date.toLocaleString("vi-VN", { month: "long" })); // Tháng bằng tiếng Việt
    }
    return months;
  };

  const months = getLastMonths(5); // Lấy 5 tháng gần nhất

  useEffect(() => {
    // Fetch dữ liệu từ API
    const fetchRevenueData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/invoices/statistics/monthly-revenue"
        );
        const data = await response.json();
        console.log("Fetched Data:", data); // Debug dữ liệu từ API
        setTotalRevenue(data.totalRevenue || 0); // Gán tổng doanh thu
        setMonthlyRevenue(data.monthlyRevenue || [0, 0, 0, 0, 0]); // Gán doanh thu hàng tháng
        setLoading(false);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);
  // Dữ liệu cho biểu đồ cột
  const barChartData = {
    labels: months, // Tháng tự động
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: monthlyRevenue, // Dữ liệu từ API
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu cho biểu đồ tròn
  const pieChartData = {
    labels: ["Doanh thu tổng"],
    datasets: [
      {
        label: "Doanh thu",
        data: [totalRevenue],
        backgroundColor: ["#FFC107"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-10 px-4 lg:px-10">
        {/* Statistics Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Tổng doanh thu"
            icon={DollarSign}
            value={totalRevenue.toLocaleString("vi-VN")} // Hiển thị định dạng tiền tệ
            color="#FFC107"
          />
          <StatCard
            name="Tổng đơn hàng"
            icon={ShoppingCart}
            value="150" // Dữ liệu mẫu
            color="#33FFFF"
          />
          <StatCard
            name="Tổng sản phẩm"
            icon={Box}
            value="350" // Dữ liệu mẫu
            color="#4CAF50"
          />
        </motion.div>

        {loading ? (
          <div className="text-center">Đang tải dữ liệu...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Biểu đồ cột */}
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-gray-700">
                Doanh thu hàng tháng
              </h2>
              <div className="h-64">
                <Bar data={barChartData} />
              </div>
            </section>

            {/* Biểu đồ tròn */}
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-gray-700">
                Doanh thu tổng
              </h2>
              <div className="h-64">
                <Pie data={pieChartData} />
              </div>
            </section>          
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
