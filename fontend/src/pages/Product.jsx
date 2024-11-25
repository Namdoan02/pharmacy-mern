const Product = () => {
  const medicines = [
    {
      code: "001",
      name: "Paracetamol",
      prescriptiondrugs: "Paracetamol",
      type: "500mg",
      quantity: "Hộp 10 vỉ x 10 viên",
    },
  ];

  const handleViewDetails = (medicine) => {
    alert(`Chi tiết thuốc: \nTên: ${medicine.name}\nHoạt chất: ${medicine.activeIngredient}\nLiều dùng: ${medicine.dosage}\nQuy cách: ${medicine.packaging}`);
  };

  return (
    <div className="p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Danh sách thuốc</h1>
      </div>
      <div className="bg-slate-300 p-3 border rounded-md">
        <table className="min-w-full bg-white border rounded-lg shadow-lg text-black">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border border-gray-300">Mã thuốc</th>
              <th className="px-4 py-2 border border-gray-300">Tên thuốc</th>
              <th className="px-4 py-2 border border-gray-300">Thuốc kê đơn</th>
              <th className="px-4 py-2 border border-gray-300">Loại thuốc</th>
              <th className="px-4 py-2 border border-gray-300">Số lượng</th>
              <th className="px-4 py-2 border border-gray-300"></th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{medicine.code}</td>
                <td className="px-4 py-2 border">{medicine.name}</td>
                <td className="px-4 py-2 border">{medicine.prescriptiondrugs}</td>
                <td className="px-4 py-2 border">{medicine.type }</td>
                <td className="px-4 py-2 border">{medicine.quantity}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => handleViewDetails(medicine)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Product;
