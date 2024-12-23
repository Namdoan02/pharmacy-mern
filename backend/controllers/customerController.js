// controllers/customerController.js
const Customer = require("../models/customerModel");

// Tạo khách hàng mới
const createCustomer = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body; // Chỉ yêu cầu name và phoneNumber

    // Kiểm tra xem số điện thoại có trùng không
    const existingCustomer = await Customer.findOne({ phoneNumber });
    if (existingCustomer) {
      return res.status(400).json({ message: "Số điện thoại này đã tồn tại!" });
    }

    // Tạo khách hàng mới chỉ với tên và số điện thoại
    const customer = new Customer({
      name,
      phoneNumber,
      // Các trường khác không cần thiết ở bước này, có thể để trống hoặc giá trị mặc định
      email: req.body.email?.trim() || undefined,
      gender: req.body.gender,
      birthDate: req.body.birthDate || "",
      address: req.body.address || "",
    });

    await customer.save();
    return res.status(201).json({
      message: "Khách hàng đã được tạo thành công!",
      customer: {
        _id: customer._id,
        name: customer.name,
        phoneNumber: customer.phoneNumber,
        email: customer.email,
        gender: customer.gender,
        birthDate: customer.birthDate,
        address: customer.address,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi tạo khách hàng." });
  }
};

// Lấy danh sách tất cả khách hàng
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    return res.status(200).json({ customers });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Không thể lấy danh sách khách hàng." });
  }
};

// Cập nhật thông tin khách hàng
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, gender, birthDate, address } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phoneNumber,
        gender,
        birthDate,
        address,
      },
      { new: true }
    );

    if (!customer) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy khách hàng với ID này." });
    }

    return res
      .status(200)
      .json({ message: "Cập nhật khách hàng thành công!", customer });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi cập nhật khách hàng." });
  }
};

// Xóa khách hàng
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy khách hàng với ID này." });
    }

    return res
      .status(200)
      .json({ message: "Khách hàng đã bị xóa thành công!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi xóa khách hàng." });
  }
};

// Tìm kiếm khách hàng
const searchCustomer = async (req, res) => {
  try {
    const { name, phoneNumber } = req.query; // Lấy tham số name và phoneNumber từ query string

    // Tạo điều kiện tìm kiếm
    let searchCondition = {};
    if (name) {
      searchCondition.name = { $regex: name, $options: "i" }; // Tìm kiếm theo tên không phân biệt chữ hoa chữ thường
    }
    if (phoneNumber) {
      searchCondition.phoneNumber = phoneNumber; // Tìm kiếm theo số điện thoại
    }

    // Tìm khách hàng theo điều kiện
    const customers = await Customer.find(searchCondition);

    // Kiểm tra xem có khách hàng nào không
    if (customers.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy khách hàng." });
    }

    return res.status(200).json({ customers });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi tìm kiếm khách hàng." });
  }
};
const searchCustomers = async (req, res) => {
  try {
    const { search } = req.query;

    const customers = await Customer.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    });

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Lỗi tìm kiếm khách hàng", error });
  }
};
module.exports = {
  createCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
};
