const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { get } = require("mongoose");
// Hàm xác thực
const auth = (req, res) => {
  res.json("Pharmacy");
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Kiểm tra xem các trường bắt buộc đã được điền chưa
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ msg: "Vui lòng điền đầy đủ các trường" });
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      return res.status(400).json({ msg: "Mật khẩu phải dài ít nhất 6 ký tự" });
    }

    // Kiểm tra xem email đã tồn tại chưa
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ msg: "Email đã tồn tại" });
    }

    // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp nhau không
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Mật khẩu không khớp" });
    }

    // Băm mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(password, 10); // 10 là độ khó băm

    // Tạo mới người dùng
    const user = new User({
      name,
      email,
      password: hashedPassword, // Sử dụng mật khẩu đã băm
    });

    // Lưu người dùng vào cơ sở dữ liệu
    await user.save();

    return res
      .status(201)
      .json({ success: true, msg: "Đăng ký thành công", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Có lỗi xảy ra, vui lòng thử lại" }); // Thông báo lỗi chung
  }
};

//login

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // Chỉ cần email và password cho đăng nhập

    // Kiểm tra xem các trường bắt buộc đã được điền chưa
    if (!email || !password) {
      return res.status(400).json({ msg: "Vui lòng điền đầy đủ các trường" });
    }

    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Email không tồn tại" });
    }

    // So sánh mật khẩu đã nhập với mật khẩu đã lưu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Mật khẩu không đúng" });
    }

    //Tạo token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload (dữ liệu sẽ được mã hóa trong token)
      process.env.JWT_SECRET, // Mã bí mật để mã hóa token
      { expiresIn: "1h" } // Thời gian hết hạn của token
    );
    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true, // Secure the cookie to be accessible only by the server
        secure: process.env.NODE_ENV === "production", // Send cookie only over HTTPS in production
        sameSite: "strict", // CSRF protection
        maxAge: 3600000, // 1 hour in milliseconds
      })
      .json({ success: true, msg: "Đăng nhập thành công", user, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Có lỗi xảy ra, vui lòng thử lại" }); // Thông báo lỗi chung
  }
};

const getProfile = async (req, res) => {
  // Lấy token từ tiêu đề Authorization
  const token = req.headers['authorization']?.split(' ')[1]; // Giả sử là Bearer token

  // Kiểm tra token
  if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
      //console.log("Token retrieved:", token); // Log token để debug

      // Giải mã token
      const decoded = await new Promise((resolve, reject) => {
          jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
              if (err) {
                  console.error("Token verification error:", err);
                  return reject(err); // Chuyển lỗi ra bên ngoài
              }
              resolve(decoded);
          });
      });

      // Lấy thông tin người dùng từ cơ sở dữ liệu
      const userId = decoded.id; // Sử dụng ID từ token đã giải mã
      const user = await User.findById(userId).select("name email");

      // Kiểm tra xem người dùng có tồn tại hay không
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      // Trả về thông tin hồ sơ
      res.json({ success: true, profile: user });
  } catch (error) {
      console.error("Error retrieving profile:", error);

      if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ success: false, message: "Session expired. Please log in again." }); // Xử lý khi token hết hạn
      }

      res.status(403).json({ success: false, message: error.message || "An error occurred" });
  }
};

module.exports = {
  auth,
  registerUser,
  loginUser,
  getProfile,
};
