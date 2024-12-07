const mongoose = require('mongoose');

// Định nghĩa Schema cho ImportData
const importDataSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  retailPrice: { type: Number, required: true },
  wholesalePrice: { type: Number, required: true },
  batchNumber: { type: String, required: true },
  manufacturingDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  importDate: { type: Date, required: true },
  supplier: { type: String, required: true },
  manufacturingPlace: { type: String, required: true }
}, { timestamps: true });

const ImportData = mongoose.model('ImportData', importDataSchema);

module.exports = ImportData;
