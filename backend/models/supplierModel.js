const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    supplierName: {
      type: String,
      required: [true, "Nhà cung cấp là bắt buộc"], // Validation: required
      trim: true, // Remove extra spaces
    },
    contactPerson: {
      type: String,
      required: [true, "Người liên hệ là bắt buộc"], // Validation: required
      trim: true,
    },
    taxCode: {
      type: String,
      required: [true, "Mã số thuế là bắt buộc"], // Validation: required
      unique: true, // Ensure no duplicates
      trim: true,
    },
    invoiceSymbol: {
      type: String,
      required: [true, "Ký hiệu hóa đơn là bắt buộc"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email là bắt buộc"], // Validation: required
      unique: true,
      trim: true,
      lowercase: true, // Always store email in lowercase
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Email không hợp lệ", // Email validation
      ],
    },
    phoneNumber: {
      type: String,
      required: [true, "Số điện thoại là bắt buộc"],
      match: [/^[0-9]{10}$/, "Số điện thoại không hợp lệ. Vui lòng nhập lại."],
    },
    address: {
      type: String,
      required: [true, "Địa chỉ là bắt buộc"],
      trim: true,
    },
  },
  { timestamps: true }
);
const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier

