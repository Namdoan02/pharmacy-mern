const Invoice = require("../models/invoiceModel");

const saveInvoice = async (req, res) => {
  try {
    const { customerName, phoneNumber, medicines, totalAmount, hospital } =
      req.body;

    // Validate input
    if (!customerName || !phoneNumber || !medicines || medicines.length === 0) {
      return res.status(400).json({
        message:
          "Vui lòng cung cấp đầy đủ thông tin hóa đơn, bao gồm tên khách hàng, số điện thoại và danh sách thuốc.",
      });
    }

    // Kiểm tra nếu là hóa đơn kê đơn, yêu cầu bệnh viện (hospital.place)
    if (hospital && typeof hospital === "object") {
      if (!hospital.place || !hospital.place.trim()) {
        return res.status(400).json({
          message:
            "Vui lòng cung cấp thông tin nơi khám bệnh trong hóa đơn kê đơn.",
        });
      }
    } else if (hospital) {
      return res.status(400).json({
        message:
          "Thông tin bệnh viện không hợp lệ. Vui lòng cung cấp một đối tượng hợp lệ.",
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
    res
      .status(201)
      .json({ message: "Hóa đơn đã lưu thành công!", data: savedInvoice });
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
        message: "Không tìm thấy hóa đơn với ID này.",
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
const getTotalRevenue = async (req, res) => {
  try {
    // Tính tổng doanh thu
    const totalRevenue = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    res.status(200).json({
      message: "Tổng doanh thu tính thành công.",
      totalRevenue: totalRevenue[0]?.totalRevenue || 0,
    });
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    res.status(500).json({
      message: "Lỗi khi tính tổng doanh thu.",
      error,
    });
  }
};
// Thống kê theo khách hàng
const getCustomerStatistics = async (req, res) => {
  try {
    // Thống kê số lượng hóa đơn và tổng chi tiêu theo khách hàng
    const customerStats = await Invoice.aggregate([
      {
        $group: {
          _id: "$customerName",
          totalInvoices: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
        },
      },
    ]);

    res.status(200).json({
      message: "Thống kê khách hàng thành công.",
      data: customerStats,
    });
  } catch (error) {
    console.error("Error fetching customer statistics:", error);
    res.status(500).json({
      message: "Lỗi khi thống kê khách hàng.",
      error,
    });
  }
};
// Thống kê theo loại thuốc
const getMedicineStatistics = async (req, res) => {
  try {
    // Thống kê số lượng từng loại thuốc được bán
    const medicineStats = await Invoice.aggregate([
      { $unwind: "$medicines" },
      {
        $group: {
          _id: "$medicines.name",
          totalQuantity: { $sum: "$medicines.quantity" },
        },
      },
    ]);

    res.status(200).json({
      message: "Thống kê thuốc thành công.",
      data: medicineStats,
    });
  } catch (error) {
    console.error("Error fetching medicine statistics:", error);
    res.status(500).json({
      message: "Lỗi khi thống kê thuốc.",
      error,
    });
  }
};
const getMonthlyRevenue = async (req, res) => {
  try {
    // Lấy ngày hiện tại
    const now = new Date();
    
    // Tạo mảng chứa 5 tháng gần nhất
    const months = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        start: new Date(date.getFullYear(), date.getMonth(), 1), // Đầu tháng
        end: new Date(date.getFullYear(), date.getMonth() + 1, 0), // Cuối tháng
      });
    }

    // Truy vấn doanh thu từng tháng
    const monthlyRevenue = await Promise.all(
      months.map(async (month) => {
        const revenue = await Invoice.aggregate([
          {
            $match: {
              createdAt: {
                $gte: month.start,
                $lte: month.end,
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalAmount" }, // Tổng tiền từ trường totalAmount
            },
          },
        ]);

        return revenue.length > 0 ? revenue[0].total : 0; // Nếu không có hóa đơn, trả về 0
      })
    );

    // Tính tổng doanh thu
    const totalRevenue = monthlyRevenue.reduce((acc, revenue) => acc + revenue, 0);

    // Gửi dữ liệu phản hồi
    res.status(200).json({
      totalRevenue,
      monthlyRevenue,
    });
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    res.status(500).json({ message: "Lỗi khi lấy doanh thu hàng tháng" });
  }
};

module.exports = {
  saveInvoice,
  getInvoice,
  getAllInvoices,
  getTotalRevenue,
  getCustomerStatistics,
  getMedicineStatistics,
  getMonthlyRevenue,
};
