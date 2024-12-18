import { useState, useEffect, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState("category");
  const [medicineNames, setMedicineNames] = useState({});
  const [isNamesLoaded, setIsNamesLoaded] = useState(false);

  // Hàm lấy danh sách ID và tên thuốc từ API
  const fetchMedicineNames = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/medicines/medicines");
      const result = await response.json();

      if (response.ok) {
        const nameMap = {};
        result.data.forEach((medicine) => {
          nameMap[medicine._id] = medicine.name;
        });
        setMedicineNames(nameMap);
        setIsNamesLoaded(true);
      } else {
        console.error("Failed to fetch medicine names");
      }
    } catch (error) {
      console.error("Error fetching medicine names:", error);
    }
  }, [medicineNames]);

  // Hàm lấy dữ liệu báo cáo từ API
  const fetchReportData = useCallback(
    async (reportType) => {
      setLoading(true);
      let url = "";

      if (reportType === "category")
        url = "http://localhost:5000/api/medicines/report/category";
      else if (reportType === "prescription")
        url = "http://localhost:5000/api/medicines/report/prescription";
      else if (reportType === "near-expiry")
        url = "http://localhost:5000/api/medicines/report/near-expiry";

      try {
        const response = await fetch(url);
        const result = await response.json();
    
        if (response.ok) {
          const labels = result.data.map((item) => item.name); // Lấy tên thuốc
          const quantities = result.data.map((item) => item.quantity); // Lấy số lượng tồn
    
          setChartData({
            labels,
            datasets: [
              {
                label: "Số lượng tồn",
                data: quantities,
                backgroundColor: labels.map(
                  () =>
                    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                      Math.random() * 255
                    )}, ${Math.floor(Math.random() * 255)}, 0.6)`
                ), // Màu sắc ngẫu nhiên
                borderColor: labels.map(
                  () =>
                    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                      Math.random() * 255
                    )}, ${Math.floor(Math.random() * 255)}, 1)`
                ), // Viền đậm hơn
                borderWidth: 1,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchMedicineNames();
  }, [fetchMedicineNames]);

  useEffect(() => {
    if (isNamesLoaded) {
      fetchReportData(selectedReport);
    }
  }, [selectedReport, isNamesLoaded, fetchReportData]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Báo Cáo Thống Kê</h2>

      {/* Dropdown chọn loại báo cáo */}
      <div className="flex justify-center mb-4">
        <select
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="category">Thống kê theo danh mục</option>
          <option value="prescription">Thống kê kê số lượng tồn</option>
          <option value="near-expiry">Thống kê thuốc sắp hết hạn</option>
        </select>
      </div>

      {/* Biểu đồ */}
      {loading ? (
        <p className="text-center">Đang tải dữ liệu...</p>
      ) : chartData && chartData.labels ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Biểu đồ thống kê" },
            },
          }}
        />
      ) : (
        <p className="text-center text-red-500">Không có dữ liệu để hiển thị.</p>
      )}
    </div>
  );
};

export default ReportChart;
