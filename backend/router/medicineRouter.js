const express = require("express");
const cors = require("cors");
const router = express.Router();
const Medicine = require("../models/medicineModel");

const {
  getAllMedicines,
  getMedicineById,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  importMedicine, // Import hàm nhập thuốc
  getLatestImportData,
  getImportHistory,
  sellMedicine,
  searchMedicine,
  getReportByDate,
  getReportByCategory,
} = require("../controllers/medicineController");

// Cấu hình CORS
router.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Route kiểm tra xem thuốc có tồn tại hay không
router.get("/check-exists", async (req, res) => {
  const { name } = req.query; // Lấy tên thuốc từ query parameters
  try {
    const medicine = await Medicine.findOne({ name }); // Tìm thuốc theo tên
    if (medicine) {
      return res.json({ exists: true }); // Thuốc đã tồn tại
    }
    return res.json({ exists: false }); // Thuốc không tồn tại
  } catch (error) {
    console.error("Error checking medicine existence:", error);
    return res.status(500).json({ message: "Error checking medicine existence" });
  }
});

// Định nghĩa các route cho thuốc
router.get("/medicines", getAllMedicines); // Lấy danh sách tất cả thuốc
router.get("/medicines/:id", getMedicineById); // Lấy thông tin thuốc theo ID
router.post("/create", addMedicine); // Thêm thuốc mới
router.put("/update/:id", updateMedicine); // Cập nhật thông tin thuốc
router.delete("/delete/:id", deleteMedicine); // Xóa thuốc
router.get("/report/category", getReportByCategory);
// Route nhập thuốc
router.post("/import/:id", importMedicine); 
router.get("/import-data/:id", getLatestImportData);
// Nhập thuốc theo ID
router.get("/import-history/:id", getImportHistory); // Lịch sử nhập thuốc theo ID
router.put("/reduce-stock/:id", sellMedicine); // Bán thuốc
router.get("/search", searchMedicine);
router.get('/report/category', async (req, res) => {
  try {
    const report = await Medicine.aggregate([
      {
        $group: {
          _id: '$category', // Gom nhóm theo ID của danh mục
          totalQuantity: { $sum: '$quantity' }, // Tổng số lượng tồn
        },
      },
      {
        $lookup: {
          from: 'categories', // Tên collection chứa thông tin danh mục hoặc tên thuốc
          localField: '_id',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $project: {
          name: { $arrayElemAt: ['$categoryDetails.name', 0] }, // Lấy tên danh mục thay vì ID
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi tạo báo cáo.' });
  }
});

// API: Lấy báo cáo kê đơn và không kê đơn
router.get('/report/prescription', async (req, res) => {
  try {
    const report = await Medicine.aggregate([
      {
        $project: {
          name: 1, // Tên thuốc
          quantity: 1, // Số lượng tồn kho
          unit: 1, // Đơn vị tính (nếu cần)
        },
      },
      {
        $sort: { quantity: -1 }, // Sắp xếp giảm dần theo số lượng tồn
      },
    ]);

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi tạo báo cáo.' });
  }
}); // Tìm kiếm thuốc
router.get('/report/near-expiry', async (req, res) => {
  const now = new Date();
  const twoMonthsLater = new Date();
  twoMonthsLater.setMonth(now.getMonth() + 2);
  try {
    const report = await Medicine.aggregate([
      { $unwind: '$importDetails' },
      {
        $match: {
          'importDetails.expiryDate': { $gte: now, $lte: twoMonthsLater },
        },
      },
    ]);
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Error generating near-expiry report:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi tạo báo cáo hết hạn.' });
  }
});
router.get('/report/medicine-names', async (req, res) => {
  try {
    // Lấy tất cả _id và name của thuốc
    const medicines = await Medicine.find({}, '_id name'); 
    res.status(200).json({ success: true, data: medicines });
  } catch (error) {
    console.error('Error fetching medicine names:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy tên thuốc.' });
  }
});
router.get("/report/by-date", getReportByDate);

module.exports = router;
