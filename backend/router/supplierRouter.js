const express = require("express");
const router = express.Router();
const cors = require("cors");
const Supplier = require("../models/supplierModel");
const {
  getAllSuppliers,
  getSupplierById,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  searchSuppliers,
} = require("../controllers/supplierController.js");

// CORS Configuration
router.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's origin
    credentials: true,
  })
);

// Check if supplier email is unique
router.get("/check-email", async (req, res) => {
  const { email } = req.query;
  try {
    const supplier = await Supplier.findOne({ email });
    if (supplier) {
      return res.json({ isUnique: false }); // Email exists
    }
    return res.json({ isUnique: true }); // Email does not exist
  } catch (error) {
    res.status(500).json({ message: "Error checking email" });
  }
});

// CRUD routes for suppliers
router.post("/create", addSupplier); // Create a new supplier
router.get("/suppliers", getAllSuppliers); // Get all suppliers
router.get("/suppliers/:id", getSupplierById); // Get a supplier by ID
router.put("/update/:id", updateSupplier); // Update a supplier by ID
router.delete("/delete/:id", deleteSupplier); // Delete a supplier by ID
router.get("/search", searchSuppliers); // Search suppliers
module.exports = router;
