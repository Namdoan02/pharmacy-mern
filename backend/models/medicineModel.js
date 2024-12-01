const mongoose = require("mongoose");

// Định nghĩa schema cho bảng Medicine
const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Tên thuốc
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // Loại thuốc (liên kết với Category)
  dosage: { type: String, required: true }, // Liều lượng
  usage: { type: String }, // Công dụng
  unit: { type: String, enum: ["Viên", "Vỉ", "Hộp"] }, // Đơn vị tính
  prescription: { type: String, enum: ["Có", "Không"]}, // Thuốc kê đơn hay không
  packaging: { type: String }, // Quy cách đóng gói
  sideEffects: { type: String }, // Tác dụng phụ
  instructions: { type: String }, // Hướng dẫn sử dụng
  description: { type: String }, // Mô tả chung
}, { timestamps: true });

// Xuất model Medicine
const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;
