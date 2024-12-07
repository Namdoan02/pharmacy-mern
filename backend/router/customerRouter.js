// routes/customerRoutes.js
const express = require('express');
const cors = require("cors");
const router = express.Router();
const {
  createCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');
router.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
// Tạo khách hàng mới
router.post('/create', createCustomer);

// Lấy danh sách khách hàng
router.get('/customers', getAllCustomers);

// Cập nhật thông tin khách hàng
router.put('/update/:id', updateCustomer);

// Xóa khách hàng
router.delete('/delete/:id', deleteCustomer);

module.exports = router;
