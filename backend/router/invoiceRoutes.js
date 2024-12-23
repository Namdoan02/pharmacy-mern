const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  saveInvoice,
  getAllInvoices,
  getInvoice,
  getTotalRevenue,
  getCustomerStatistics,
  getMedicineStatistics,
  getMonthlyRevenue
} = require("../controllers/invoiceController");
router.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
router.post("/create", saveInvoice);
router.get("/invoices", getAllInvoices);
router.get("/invoice/:id", getInvoice);
// Route: Tổng doanh thu
router.get("/statistics/total-revenue", getTotalRevenue);

// Route: Thống kê theo khách hàng
router.get("/statistics/customers", getCustomerStatistics);

// Route: Thống kê theo loại thuốc
router.get("/statistics/medicines", getMedicineStatistics);
router.get("/statistics/monthly-revenue", getMonthlyRevenue);
module.exports = router;
