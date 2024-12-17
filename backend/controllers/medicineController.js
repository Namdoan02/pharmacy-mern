const Medicine = require("../models/medicineModel"); // Adjust the path as needed
const mongoose = require("mongoose");

// Lấy danh sách tất cả thuốc
const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find()
      .select("name category prescription quantity") // Chỉ lấy các trường cần thiết
      .populate("category", "name")
    res.status(200).json({
      message: "Danh sách thuốc",
      data: medicines,
    });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách thuốc", error });
  }
};

// Lấy thông tin thuốc theo ID
const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID thuốc không hợp lệ" });
    }

    const medicine = await Medicine.findById(id).populate("category")
    if (!medicine) {
      return res.status(404).json({ message: "Không tìm thấy thuốc" });
    }

    res.status(200).json({
      message: "Lấy thông tin thuốc thành công",
      data: medicine,
    });
  } catch (error) {
    console.error("Error fetching medicine:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin thuốc", error });
  }
};

// Thêm thuốc mới
const addMedicine = async (req, res) => {
  try {
    const {
      name,
      category,
      dosage,
      usage,
      unit,
      prescription,
      packaging,
      sideEffects,
      instructions,
      description,
    } = req.body;

    // Validate input
    if (!name || !category || !description || !dosage || !usage || !unit || !prescription || !packaging || !sideEffects || !instructions){
      return res.status(400).json({ message: "Vui lòng điền tất cả các thông tin" });
    }
    const existingMedicine = await Medicine.findOne({ name });
    if (existingMedicine) {
      return res.status(400).json({ message: "Tên thuốc đã tồn tại. Vui lòng chọn tên khác." });
    }

    const newMedicine = new Medicine({
      name,
      category,
      description,
      dosage,
      usage,
      unit,
      prescription,
      packaging,
      sideEffects,
      instructions,
      
    });

    const savedMedicine = await newMedicine.save();
    res.status(201).json({
      message: "Thêm thuốc thành công",
      data: savedMedicine,
    });
  } catch (error) {
    console.error("Error adding medicine:", error);
    res.status(400).json({ message: "Lỗi khi thêm thuốc", error });
  }
};

// Cập nhật thuốc
const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      dosage,
      usage,
      unit,
      prescription,
      packaging,
      sideEffects,
      instructions,
      description,
      quantity,
 // Thêm ID của ImportData
    } = req.body;

    // Kiểm tra tính hợp lệ của ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID thuốc không hợp lệ" });
    }

    // Tìm thuốc theo ID
    let medicine = await Medicine.findById(id).populate("category")

    if (!medicine) {
      return res.status(404).json({ message: "Không tìm thấy thuốc" });
    }

    // Cập nhật các trường khác
    medicine.name = name || medicine.name;
    medicine.category = category || medicine.category;
    medicine.dosage = dosage || medicine.dosage;
    medicine.usage = usage || medicine.usage;
    medicine.unit = unit || medicine.unit;
    medicine.prescription = prescription || medicine.prescription;
    medicine.packaging = packaging || medicine.packaging;
    medicine.sideEffects = sideEffects || medicine.sideEffects;
    medicine.instructions = instructions || medicine.instructions;
    medicine.description = description || medicine.description;
    if (quantity !== undefined) {
      medicine.quantity += parseInt(quantity);
    }

    // Lưu thông tin thuốc đã cập nhật
    const updatedMedicine = await medicine.save();

    // Trả về thông tin thuốc đã cập nhật
    res.status(200).json({
      message: "Cập nhật thuốc thành công",
      data: updatedMedicine,
    });
  } catch (error) {
    console.error("Error updating medicine:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật thuốc", error });
  }
};



// Xóa thuốc
const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID thuốc không hợp lệ" });
    }

    const deletedMedicine = await Medicine.findByIdAndDelete(id);
    if (!deletedMedicine) {
      return res.status(404).json({ message: "Không tìm thấy thuốc" });
    }

    res.status(200).json({
      message: "Xóa thuốc thành công",
      data: deletedMedicine,
    });
  } catch (error) {
    console.error("Error deleting medicine:", error);
    res.status(500).json({ message: "Lỗi khi xóa thuốc", error });
  }
};

const importMedicine = async (req, res) => {
  try {
    const { id } = req.params; // ID của thuốc
    const {
      quantity,
      purchasePrice,
      retailPrice,
      wholesalePrice,
      batchNumber,
      manufacturingDate,
      expiryDate,
      importDate,
      supplier,
      manufacturingPlace,
    } = req.body;

    // Kiểm tra tính hợp lệ của ID thuốc
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID thuốc không hợp lệ" });
    }

    // Kiểm tra đầu vào
    if (
      !quantity ||
      !purchasePrice ||
      !retailPrice ||
      !wholesalePrice ||
      !batchNumber ||
      !manufacturingDate ||
      !expiryDate ||
      !importDate ||
      !supplier ||
      !manufacturingPlace
    ) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ các thông tin nhập thuốc." });
    }

    // Tìm thuốc theo ID
    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(404).json({ message: "Không tìm thấy thuốc." });
    }

    // Cập nhật số lượng thuốc
    medicine.quantity += quantity;

    // Thêm thông tin nhập khẩu vào mảng importDetails
    const importData = {
      quantity,
      purchasePrice,
      retailPrice,
      wholesalePrice,
      batchNumber,
      manufacturingDate,
      expiryDate,
      importDate,
      supplier,
      manufacturingPlace,
    };

    medicine.importDetails.push(importData);

    // Lưu thông tin thuốc đã cập nhật
    const updatedMedicine = await medicine.save();

    res.status(200).json({
      message: "Nhập thuốc thành công",
      data: updatedMedicine,
    });
  } catch (error) {
    console.error("Error importing medicine:", error);
    res.status(500).json({ message: "Lỗi khi nhập thuốc", error });
  }
};

const getLatestImportData = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID thuốc không hợp lệ" });
    }

    const medicine = await Medicine.findById(id).select("importDetails");

    if (!medicine || !medicine.importDetails || medicine.importDetails.length === 0) {
      return res.status(404).json({ message: "Không có dữ liệu nhập thuốc." });
    }

    // Lấy dữ liệu nhập thuốc gần nhất
    const latestImport = medicine.importDetails[medicine.importDetails.length - 1];

    res.status(200).json({
      message: "Dữ liệu nhập thuốc gần nhất",
      data: latestImport,
    });
  } catch (error) {
    console.error("Error fetching import data:", error);
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu nhập thuốc", error });
  }
};
// Lấy toàn bộ lịch sử nhập kho (importHistory) của một thuốc
const getImportHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra tính hợp lệ của ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID thuốc không hợp lệ" });
    }

    // Tìm thuốc theo ID và lấy toàn bộ lịch sử nhập kho
    const medicine = await Medicine.findById(id).select("importDetails");

    if (!medicine || !medicine.importDetails || medicine.importDetails.length === 0) {
      return res.status(404).json({ message: "Không có lịch sử nhập kho cho thuốc này." });
    }

    // Trả về toàn bộ lịch sử nhập kho
    res.status(200).json({
      message: "Lịch sử nhập kho của thuốc",
      data: medicine.importDetails,
    });
  } catch (error) {
    console.error("Error fetching import history:", error);
    res.status(500).json({ message: "Lỗi khi lấy lịch sử nhập kho", error });
  }
};
// Bán thuốc
const sellMedicine = async (req, res) => {
  try {
    const { id } = req.params; // ID của thuốc
    const { quantity } = req.body; // Số lượng cần bán

    // Kiểm tra tính hợp lệ của ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID thuốc không hợp lệ" });
    }

    // Kiểm tra đầu vào
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Số lượng bán phải lớn hơn 0." });
    }

    // Tìm thuốc theo ID
    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({ message: "Không tìm thấy thuốc." });
    }

    // Kiểm tra số lượng trong kho
    if (medicine.quantity < quantity) {
      return res
        .status(400)
        .json({ message: "Số lượng trong kho không đủ để bán." });
    }

    // Giảm số lượng thuốc
    medicine.quantity -= quantity;

    // Lưu thông tin thuốc đã cập nhật
    const updatedMedicine = await medicine.save();

    res.status(200).json({
      message: "Bán thuốc thành công",
      data: updatedMedicine,
    });
  } catch (error) {
    console.error("Error selling medicine:", error);
    res.status(500).json({ message: "Lỗi khi bán thuốc", error });
  }
};
// Tìm kiếm thuốc theo tên hoặc công dụng
const searchMedicine = async (req, res) => {
  try {
    const { keyword } = req.query; // Lấy từ khóa tìm kiếm từ query string

    if (!keyword) {
      return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm." });
    }

    // Tìm thuốc theo tên hoặc công dụng (mô tả)
    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } }, // Tìm kiếm không phân biệt hoa thường
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("name description quantity price unit"); // Chỉ lấy các trường cần thiết

    if (medicines.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy thuốc nào." });
    }

    res.status(200).json({
      message: "Kết quả tìm kiếm thuốc",
      data: medicines,
    });
  } catch (error) {
    console.error("Error searching medicine:", error);
    res.status(500).json({ message: "Lỗi khi tìm kiếm thuốc", error });
  }
};


module.exports = {
  getAllMedicines,
  getMedicineById,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  importMedicine,
  getLatestImportData,
  getImportHistory,
  sellMedicine, // Thêm bán thuốc
  searchMedicine,
};
