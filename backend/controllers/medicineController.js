const Medicine = require("../models/medicineModel"); // Adjust the path as needed
const mongoose = require("mongoose");

// Lấy danh sách tất cả thuốc
const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find()
      .select("name category prescription quantity") // Chỉ lấy các trường cần thiết
      .populate("category", "name"); // Chỉ lấy tên của loại thuốc

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

    const medicine = await Medicine.findById(id).populate("category");
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
    } = req.body;

    // Kiểm tra tính hợp lệ của ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID thuốc không hợp lệ" });
    }

    // Tìm thuốc theo ID
    let medicine = await Medicine.findById(id).populate('category'); // Populate category ở đây

    if (!medicine) {
      return res.status(404).json({ message: "Không tìm thấy thuốc" });
    }

    // Cập nhật thông tin thuốc
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

    // Lưu thông tin thuốc đã cập nhật
    const updatedMedicine = await medicine.save();

    // Trả về thông tin thuốc đã cập nhật cùng với thông tin của category
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

module.exports = {
  getAllMedicines,
  getMedicineById,
  addMedicine,
  updateMedicine,
  deleteMedicine,
};
