import { useContext } from "react";
import { UserContext } from "../../context/usercontext"; // Đảm bảo bạn đang nhập đúng UserContext

const InvoicePrint = ({ savedInvoice }) => {
  const { user, loading } = useContext(UserContext); // Lấy dữ liệu từ UserContext

  const printInvoice = () => {
    if (!savedInvoice || loading || !user) {
      console.log("Dữ liệu chưa sẵn sàng để in");
      return;
    }

    console.log("Tên nhân viên từ context:", user.name);
    const formattedDate = new Date(savedInvoice.createdAt).toLocaleString();

    const printContent = `
      <div style="font-family: Arial, sans-serif; margin: 20px; position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <img src="logo.png" alt="Logo" style="height: 80px;">
          <h2 style="text-align: center; flex-grow: 1;">Hóa Đơn Bán Thuốc</h2>
        </div>
        <p><strong>Tên khách hàng:</strong> ${savedInvoice.customerName}</p>
        <p><strong>Số điện thoại:</strong> ${savedInvoice.phoneNumber}</p>
        <p><strong>Nhân viên lập hóa đơn:</strong> ${user?.name || "Không xác định"}</p>
        <p><strong>Ngày giờ tạo hóa đơn:</strong> ${formattedDate}</p>
        <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; text-align: center; margin-top: 20px;">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên thuốc</th>
              <th>Số lượng</th>
              <th>Đơn vị tính</th>
              <th>Giá bán</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${savedInvoice.medicines
              .map(
                (item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.unit}</td>
                <td>${item.price.toLocaleString("vi-VN")} ₫</td>
                <td>${(item.price * item.quantity).toLocaleString("vi-VN")} ₫</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <h3 style="text-align: right; margin-top: 20px;">
          Tổng tiền: ${savedInvoice.totalAmount.toLocaleString("vi-VN")} ₫
          (Đã bao gồm VAT)
        </h3>
      </div>
    `;

    // Print logic
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
      <html>
        <head>
          <title>In hóa đơn</title>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    iframeDoc.close();

    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  return (
    <button
      onClick={printInvoice}
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      disabled={loading}
    >
      {loading ? "Đang tải..." : "In hóa đơn"}
    </button>
  );
};

export default InvoicePrint;
