const ImportData = require('../models/importDataModel');

// Tạo mới một bản ghi thuốc nhập khẩu
const createImportData = async (req, res) => {
  try {
    const newImportData = new ImportData(req.body);
    await newImportData.save();
    res.status(201).json({ message: 'Import data created successfully', data: newImportData });
  } catch (error) {
    res.status(400).json({ message: 'Error creating import data', error });
  }
};

// Lấy danh sách tất cả bản ghi nhập khẩu
const getAllImportData = async (req, res) => {
  try {
    const importData = await ImportData.find();
    res.status(200).json(importData);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching import data', error });
  }
};

// Lấy chi tiết một bản ghi thuốc nhập khẩu theo ID
const getImportDataById = async (req, res) => {
  try {
    const importData = await ImportData.findById(req.params.id);
    if (!importData) {
      return res.status(404).json({ message: 'Import data not found' });
    }
    res.status(200).json(importData);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching import data', error });
  }
};

// Cập nhật thông tin bản ghi thuốc nhập khẩu theo ID
const updateImportData = async (req, res) => {
  try {
    const updatedImportData = await ImportData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedImportData) {
      return res.status(404).json({ message: `Import data not found ${updatedImportData}` });
    }
    res.status(200).json({ message: 'Import data updated successfully', data: updatedImportData });
  } catch (error) {
    res.status(400).json({ message: 'Error updating import data', error });
  }
};

// Xóa bản ghi thuốc nhập khẩu theo ID
const deleteImportData = async (req, res) => {
  try {
    const deletedImportData = await ImportData.findByIdAndDelete(req.params.id);
    if (!deletedImportData) {
      return res.status(404).json({ message: 'Import data not found' });
    }
    res.status(200).json({ message: 'Import data deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting import data', error });
  }
};

// Export các hàm
module.exports = {
  createImportData,
  getAllImportData,
  getImportDataById,
  updateImportData,
  deleteImportData
};
