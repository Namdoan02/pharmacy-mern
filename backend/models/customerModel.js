const mongoose = require("mongoose");

// Schema cho Customer
const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: false, unique: true },
    email: { type: String, unique: false, sparse: true },
    gender: { type: String, enum: ["Nam", "Nữ", "Khác"], required: false },
    birthDate: { type: Date, required: false },
    address: { type: String, required: false },
  },
  { timestamps: true }
);

// Tạo model Customer
const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
