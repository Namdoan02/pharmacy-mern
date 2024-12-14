// controllers/customerController.js
const Customer = require('../models/customerModel');

// Tạo khách hàng mới
const createCustomer = async (req, res) => {
  try {
    const { name, phoneNumber, gender, birthDate, address } = req.body;
    
    // Kiểm tra xem số điện thoại có trùng không
    const existingCustomer = await Customer.findOne({ phoneNumber });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Số điện thoại này đã tồn tại!' });
    }

    // Tạo khách hàng mới
    const customer = new Customer({
      name,
      email,
      phoneNumber,
      gender,
      birthDate,
      address,
    });

    await customer.save();
    return res.status(201).json({ message: 'Khách hàng đã được tạo thành công!', customer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo khách hàng.' });
  }
};

// Lấy danh sách tất cả khách hàng
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    return res.status(200).json({ customers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Không thể lấy danh sách khách hàng.' });
  }
};

// Cập nhật thông tin khách hàng
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name,email, phoneNumber, gender, birthDate, address } = req.body;

    const customer = await Customer.findByIdAndUpdate(id, {
      name,
      email,
      phoneNumber,
      gender,
      birthDate,
      address,
    }, { new: true });

    if (!customer) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng với ID này.' });
    }

    return res.status(200).json({ message: 'Cập nhật khách hàng thành công!', customer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật khách hàng.' });
  }
};

// Xóa khách hàng
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndDelete(id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng với ID này.' });
    }

    return res.status(200).json({ message: 'Khách hàng đã bị xóa thành công!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa khách hàng.' });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
};
