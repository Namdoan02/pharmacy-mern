const express = require("express");
const cors = require("cors");
const router = express.Router();
const {
  createImportData,
  getAllImportData,
  updateImportData,
  deleteImportData,
} = require("../controllers/importDataController");

// Cấu hình CORS cho router
router.use(
  cors({
    origin: "http://localhost:5173", // Điều chỉnh nếu cần thiết cho domain frontend của bạn
    credentials: true,
  })
);

// Định nghĩa các endpoint cho các thao tác CRUD
router.post("/create", createImportData); // Tạo mới bản ghi nhập khẩu
router.get("/import-data", getAllImportData); // Lấy tất cả bản ghi nhập khẩu
router.put("/update/:id", updateImportData); // Cập nhật thông tin bản ghi nhập khẩu theo ID
router.delete("/delete/:id", deleteImportData); // Xóa bản ghi nhập khẩu theo ID

module.exports = router;
