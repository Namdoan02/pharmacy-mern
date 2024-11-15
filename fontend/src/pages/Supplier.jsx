import { useState } from "react";

function Supplier() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Danh sách nhà cung cấp</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
          Tạo mới
        </button>
      </div>
      <div className="bg-slate-400 full-h-screen p-3 border rounded-md">
        <div className=" grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm nhà cung cấp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="col-span-1 md:col-span-2 border border-gray-300 rounded-md p-2"
          />
        </div>
        <table className="min-w-full bg-white border rounded-lg shadow-lg text-black">
          <thead>
            <tr className="bg-gray-200 text-gray-600">
              <th className="px-4 py-2">STT</th>
              <th className="px-4 py-2">Tên nhà cung cấp</th>
              <th className="px-4 py-2">Người liên hệ</th>
              <th className="px-4 py-2">Mã số thuế</th>
              <th className="px-4 py-2">Kí hiệu hóa đơn</th>
              <th className="px-4 py-2">Số điện thoại</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Địa chỉ</th>
              <th className="px-4 py-2">Hành động</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
}

export default Supplier;
