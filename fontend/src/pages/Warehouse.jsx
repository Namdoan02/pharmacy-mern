import { useState } from "react";

function WarehouseEntry() {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Dummy data for the warehouse entries
  const entries = [
    {
      id: 1,
      code: "NK-khudoc-41068940",
      orderNumber: "112302",
      supplier: "Công ty AC Milan",
      createdBy: "Phúc Minh",
      date: "10/05/2023",
      total: "1.200.000 ₫",
      status: "Đã hoàn tất",
    },
    {
      id: 2,
      code: "NK-khudoc-43bd89a",
      orderNumber: "HD46332",
      supplier: "Công Ty Cổ Phần Dược Vĩnh Kim",
      createdBy: "Nhon Hòa",
      date: "08/05/2023",
      total: "22.000.000 ₫",
      status: "Đã hoàn tất",
    },
    // ... add more dummy data as needed
  ];

  return (
    <div className="p-6 bg-gray-500 min-h-screen relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Danh sách nhập kho</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
          Tạo mới
        </button>
      </div>
      <div className="bg-slate-300 full-h-screen p-3 border rounded-md">
        <div className=" grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm đơn nhập kho..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="col-span-1 md:col-span-2 border border-gray-300 rounded-md p-2"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-black"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-black"
          />
          <button className="bg-blue-600 text-white px-2 py-2 rounded-lg">
            Tìm kiếm
          </button>
        </div>

        <table className="min-w-full bg-white border rounded-lg shadow-lg text-black">
          <thead>
            <tr className="bg-gray-200 text-gray-600">
              <th className="px-4 py-2 border">STT</th>
              <th className="px-4 py-2 border">Mã hóa đơn</th>
              <th className="px-4 py-2 border">Số HD</th>
              <th className="px-4 py-2 border">Nhà cung cấp</th>
              <th className="px-4 py-2 border">Tạo bởi</th>
              <th className="px-4 py-2 border">Ngày nhập</th>
              <th className="px-4 py-2 border">Tổng cộng</th>
              <th className="px-4 py-2 border">Trạng thái</th>
              <th className="px-4 py-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.id} className="text-center">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{entry.code}</td>
                <td className="px-4 py-2 border">{entry.orderNumber}</td>
                <td className="px-4 py-2 border">{entry.supplier}</td>
                <td className="px-4 py-2 border">{entry.createdBy}</td>
                <td className="px-4 py-2 border">{entry.date}</td>
                <td className="px-4 py-2 border">{entry.total}</td>
                <td className="px-4 py-2 border">
                  <span
                    className={`px py-1 rounded-full ${
                      entry.status === "Đã hoàn tất"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {entry.status}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  <button className="bg-gray-300 hover:bg-gray-400 text-gray-600 font-semibold py-1 px-3 rounded-lg">
                    •••
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4 text-black">
          <div>Rows per page:</div>
          <div>1-10 of {entries.length}</div>
          <div>
            <button className="px-2 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300 text-black">
              {"<"}
            </button>
            <button className="ml-2 px-2 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300 text-black">
              {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WarehouseEntry;
