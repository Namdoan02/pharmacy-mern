const Invoice = require("../models/invoiceModel");

const saveInvoice = async (req, res) => {
  try {
    const { customerName, phoneNumber, medicines, totalAmount, hospital } = req.body;

    // Validate input
    if (!customerName || !phoneNumber || !medicines || medicines.length === 0) {
      return res.status(400).json({
        message: "Vui lòng cung cấp đầy đủ thông tin hóa đơn, bao gồm tên khách hàng, số điện thoại và danh sách thuốc."
      });
    }

    // Kiểm tra nếu là hóa đơn kê đơn, yêu cầu bệnh viện (hospital.place)
    if (hospital && typeof hospital === "object") {
      if (!hospital.place || !hospital.place.trim()) {
        return res.status(400).json({
          message: "Vui lòng cung cấp thông tin nơi khám bệnh trong hóa đơn kê đơn."
        });
      }
    } else if (hospital) {
      return res.status(400).json({
        message: "Thông tin bệnh viện không hợp lệ. Vui lòng cung cấp một đối tượng hợp lệ."
      });
    }

    // Tạo hóa đơn mới
    const newInvoice = new Invoice({
      customerName,
      phoneNumber,
      medicines,
      totalAmount,
      hospital: hospital || null, // Lưu hospital nếu có, null nếu không
    });

    // Lưu hóa đơn vào cơ sở dữ liệu
    const savedInvoice = await newInvoice.save();

    // Trả về phản hồi thành công
    res.status(201).json({ message: "Hóa đơn đã lưu thành công!", data: savedInvoice });
  } catch (error) {
    console.error("Error saving invoice:", error);
    res.status(500).json({ message: "Lỗi khi lưu hóa đơn.", error });
  }
};

// Lấy thông tin hóa đơn theo ID
const getInvoice = async (req, res) => {
  try {
    // Lấy invoiceId từ tham số route
    const { invoiceId } = req.params;

    // Tìm hóa đơn trong cơ sở dữ liệu theo ID
    const invoice = await Invoice.findById(invoiceId);

    // Kiểm tra nếu không tìm thấy hóa đơn
    if (!invoice) {
      return res.status(404).json({
        message: "Không tìm thấy hóa đơn với ID này."
      });
    }

    // Trả về hóa đơn tìm thấy
    res.status(200).json({
      message: "Lấy thông tin hóa đơn thành công.",
      data: invoice,
    });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({
      message: "Lỗi khi lấy thông tin hóa đơn.",
      error,
    });
  }
};

const getAllInvoices = async (req, res) => {
  try {
    // Lấy tất cả hóa đơn từ cơ sở dữ liệu
    const invoices = await Invoice.find();

    // Trả về danh sách hóa đơn
    res.status(200).json({
      message: "Lấy danh sách hóa đơn thành công.",
      data: invoices,
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách hóa đơn.",
      error,
    });
  }
};
module.exports = { saveInvoice, getInvoice, getAllInvoices };
