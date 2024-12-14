
const mongoose = require('mongoose');

// Schema cho Customer
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['Nam', 'Nữ', 'Khác'], required: true },
  birthDate: { type: Date, required: true },
  address: { type: String, required: true },
}, { timestamps: true });

// Tạo model Customer
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
