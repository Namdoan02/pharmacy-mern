const express = require("express");
const router = express.Router();
const cors = require("cors");
const { saveInvoice, getAllInvoices, getInvoice } = require("../controllers/invoiceController");
router.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
router.post("/create", saveInvoice);
router.get('/invoices', getAllInvoices);
router.get('/invoice/:id', getInvoice);

module.exports = router;
