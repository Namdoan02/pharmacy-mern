const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  medicines: [
    {
      medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
      name: String,
      quantity: Number,
      unit: String,
      price: Number,
      total: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  hospital: {
    place: String,
    medicalCode: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
