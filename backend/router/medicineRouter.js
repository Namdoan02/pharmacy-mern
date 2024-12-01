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
} = require("../controllers/medicineController");

router.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
router.get("/check-exists", async (req, res) => {
  const { name } = req.query; // Get the medicine name from the query parameters
  try {
    const medicine = await Medicine.findOne({ name }); // Query the database for a medicine with the given name
    if (medicine) {
      return res.json({ exists: true }); // Medicine exists
    }
    return res.json({ exists: false }); // Medicine does not exist
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

module.exports = router;
