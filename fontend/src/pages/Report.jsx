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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState("category");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [medicineNames, setMedicineNames] = useState({});
  const [isNamesLoaded, setIsNamesLoaded] = useState(false);
  const [listData, setListData] = useState([]);

  // Hàm lấy danh sách ID và tên thuốc từ API
  const fetchMedicineNames = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/medicines/medicines"
      );
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
  }, []);

  // Hàm lấy dữ liệu báo cáo từ API
  const fetchReportData = useCallback(
    async (reportType, startDate = "", endDate = "") => {
      setLoading(true);
      let url = "";

      if (reportType === "category")
        url = "http://localhost:5000/api/medicines/report/category";
      else if (reportType === "prescription")
        url = "http://localhost:5000/api/medicines/report/prescription";
      else if (reportType === "near-expiry")
        url = "http://localhost:5000/api/medicines/report/near-expiry";
      else if (reportType === "by-date" && startDate && endDate)
        url = `http://localhost:5000/api/medicines/report/by-date?startDate=${startDate}&endDate=${endDate}`;

      try {
        const response = await fetch(url);
        const result = await response.json();

        if (response.ok) {
          if (reportType === "by-date") {
            setListData(result.data);
          } else {
            const labels = result.data.map((item) => item.name);
            const quantities = result.data.map((item) => item.quantity);
            const expiryDates = result.data.map((item) => item.expiryDate); // Add expiry dates

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
                  ),
                  borderColor: labels.map(
                    () =>
                      `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                        Math.random() * 255
                      )}, ${Math.floor(Math.random() * 255)}, 1)`
                  ),
                  borderWidth: 1,
                },
              ],
            });
            // Customize tooltip
            setChartData((prevData) => ({
              ...prevData,
              options: {
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const index = context.dataIndex;
                        return `${labels[index]}: ${quantities[index]} (HSD: ${expiryDates[index]})`;
                      },
                    },
                  },
                },
              },
            }));
          }
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
    fetchMedicineNames(medicineNames);
  }, []);

  useEffect(() => {
    if (isNamesLoaded) {
      if (
        selectedReport === "by-date" &&
        selectedStartDate &&
        selectedEndDate
      ) {
        fetchReportData(selectedReport, selectedStartDate, selectedEndDate);
      } else {
        fetchReportData(selectedReport);
      }
    }
  }, [
    selectedReport,
    selectedStartDate,
    selectedEndDate,
    isNamesLoaded,
    fetchReportData,
  ]);

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
          <option value="prescription">Thống kê số lượng tồn</option>
          <option value="near-expiry">Thống kê thuốc sắp hết hạn</option>
          <option value="by-date">Thống kê theo ngày</option>
        </select>
      </div>

      {/* Input chọn ngày nếu loại báo cáo là by-date */}
      {selectedReport === "by-date" && (
        <div className="flex justify-center mb-4 space-x-4">
          <input
            type="date"
            value={selectedStartDate}
            onChange={(e) => setSelectedStartDate(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={selectedEndDate}
            onChange={(e) => setSelectedEndDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
      )}

      {/* Biểu đồ hoặc danh sách */}
      {loading ? (
        <p className="text-center">Đang tải dữ liệu...</p>
      ) : selectedReport === "by-date" ? (
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4 text-blue-600">
            Danh sách số lượng tồn
          </h3>
          {listData.length > 0 ? (
            <div className="overflow-x-auto ">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100 ">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-center text-gray-700">
                      Tên thuốc
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-gray-700">
                      Số lượng tồn
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-gray-700">
                      Số lượng đã bán
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listData.map((item, index) => (
                    <tr key={index} className="odd:bg-white even:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-gray-800 text-left">
                        {item.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-800">
                        {item.stockQuantity}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-800">
                        {item.soldQuantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-red-500">Không có dữ liệu để hiển thị.</p>
          )}
        </div>
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
        <p className="text-center text-red-500">
          Không có dữ liệu để hiển thị.
        </p>
      )}
    </div>
  );
};

export default ReportChart;
