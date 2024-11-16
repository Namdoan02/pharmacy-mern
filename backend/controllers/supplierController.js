const Supplier = require("../models/supplierModel"); // Adjust path as needed
const mongoose = require("mongoose");

const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json({
      message: "Danh sách nhà cung cấp",
      data: suppliers,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách nhà cung cấp", error });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid supplier ID" });
    }

    // Find the supplier by ID
    const supplier = await Supplier.findById(id);

    // If supplier is not found
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Return supplier data
    return res.status(200).json({
      message: "Supplier fetched successfully",
      data: supplier,
    });
  } catch (error) {
    console.error("Error fetching supplier:", error);

    // Handle server errors
    return res.status(500).json({
      message: "Error fetching supplier",
      error: error.message,
    });
  }
};

const addSupplier = async (req, res) => {
  try {
    const newSupplier = new Supplier(req.body);
    const savedSupplier = await newSupplier.save();
    res.status(201).json({
      message: "Nhà cung cấp đã được thêm thành công",
      data: savedSupplier,
    });
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi thêm nhà cung cấp", error });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      supplierName,
      contactPerson,
      taxCode,
      invoiceSymbol,
      email,
      phoneNumber,
      address,
    } = req.body;

    // Validate required fields
    if (
      !supplierName ||
      !contactPerson ||
      !taxCode ||
      !email ||
      !phoneNumber ||
      !address
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate the supplier ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid supplier ID" });
    }

    // Find the supplier by ID
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Check if the email is already in use by another supplier
    if (email !== supplier.email) {
      const existingSupplier = await Supplier.findOne({
        email,
        _id: { $ne: supplier._id },
      }); // Exclude the current supplier
      if (existingSupplier) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Update supplier fields
    supplier.supplierName = supplierName || supplier.supplierName;
    supplier.contactPerson = contactPerson || supplier.contactPerson;
    supplier.taxCode = taxCode || supplier.taxCode;
    supplier.invoiceSymbol = invoiceSymbol || supplier.invoiceSymbol;
    supplier.email = email || supplier.email;
    supplier.phoneNumber = phoneNumber || supplier.phoneNumber;
    supplier.address = address || supplier.address;

    // Save the updated supplier
    const updatedSupplier = await supplier.save();

    res.status(200).json({
      message: "Supplier updated successfully",
      supplier: {
        id: updatedSupplier._id,
        supplierName: updatedSupplier.supplierName,
        contactPerson: updatedSupplier.contactPerson,
        taxCode: updatedSupplier.taxCode,
        invoiceSymbol: updatedSupplier.invoiceSymbol,
        email: updatedSupplier.email,
        phoneNumber: updatedSupplier.phoneNumber,
        address: updatedSupplier.address,
      },
    });
  } catch (error) {
    console.error("Error updating supplier:", error);
    res.status(500).json({
      message: "Error updating supplier",
      error: error.message,
    });
  }
};


const deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier) {
      return res.status(404).json({ message: "Không tìm thấy nhà cung cấp" });
    }
    res.status(200).json({
      message: "Nhà cung cấp đã được xóa thành công",
      data: deletedSupplier,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa nhà cung cấp", error });
  }
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  addSupplier,
  updateSupplier,
  deleteSupplier,
};
