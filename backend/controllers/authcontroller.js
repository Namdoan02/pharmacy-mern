const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel"); // Ensure User model is correctly required

// Placeholder function for basic route testing
const auth = (req, res) => {
  res.json("Pharmacy");
};

// Login function with JWT token generation and admin check
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ msg: "Vui lòng điền đầy đủ các trường" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Email không tồn tại" });
    }

    // Compare entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Mật khẩu không đúng" });
    }

    // Check if user has admin role
    const isAdmin = user.role === "admin";

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin }, // Payload includes admin status
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the JWT token as an HTTP-only cookie
    return res
      .status(200)
      .cookie("authorization", token, {
        httpOnly: true, // Secure the cookie to be accessible only by the server
        secure: process.env.NODE_ENV === "production", // Send cookie only over HTTPS in production
        sameSite: "strict", // CSRF protection
        maxAge: 3600000, // 1 hour in milliseconds
      })
      .json({ success: true, msg: "Đăng nhập thành công", isAdmin, user: { name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ msg: "Có lỗi xảy ra, vui lòng thử lại" });
  }
};

// Profile retrieval function with token verification and admin check
const getProfile = async (req, res) => {
  // Retrieve token from authorization header
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the ID from the decoded token
    const user = await User.findById(decoded.id).select("name email role");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if user is an admin
    const isAdmin = user.role === "admin";

    res.json({ success: true, profile: user, isAdmin });
  } catch (error) {
    console.error("Error retrieving profile:", error);

    // Handle token expiration and other errors
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
