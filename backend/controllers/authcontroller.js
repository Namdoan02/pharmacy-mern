const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const auth = (req, res) => {
  res.json("Pharmacy");
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Vui lòng điền đầy đủ các trường" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Email không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Mật khẩu không đúng" });
    }

    const isAdmin = user.role === "admin";
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200)
      .cookie("authorization", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000, 
      })
      .json({
        success: true,
        msg: "Đăng nhập thành công",
        isAdmin,
        user: { name: user.name, email: user.email, role: user.role },
        token,
      });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ msg: "Có lỗi xảy ra, vui lòng thử lại" });
  }
};

const getProfile = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("name email role");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isAdmin = user.role === "admin";
    res.json({ success: true, profile: user, isAdmin });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    }

    res.status(403).json({ success: false, message: error.message || "An error occurred" });
  }
};

module.exports = {
  auth,
  loginUser,
  getProfile,
};
