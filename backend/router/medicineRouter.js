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

// Route nhập thuốc
router.post("/import/:id", importMedicine); 
router.get("/import-data/:id", getLatestImportData);
// Nhập thuốc theo ID
router.get("/import-history/:id", getImportHistory); // Lịch sử nhập thuốc theo ID
router.put("/reduce-stock/:id", sellMedicine); // Bán thuốc
router.get("/search", searchMedicine); // Tìm kiếm thuốc
module.exports = router;
