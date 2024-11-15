const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password from the response
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve users", error: error.message });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from route parameters
    const user = await User.findById(id).select("-password"); // Exclude password from the response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user); // Respond with the user data
  } catch (error) {
    console.error("Error fetching user by ID:", error.message);
    res.status(500).json({
      message: "Error retrieving user",
      error: error.message,
    });
  }
};
// Create a new user
const createUser = async (req, res) => {
  const { name, role, email, phone, password } = req.body;

  // Check if all required fields are provided
  if (!name || !role || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      role,
      email,
      phone,
      password: hashedPassword, // Use hashed password
    });

    const newUser = await user.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create user", error: error.message });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const {id} = req.params;
    const { name, email, role, phone, password } = req.body;
    if (!name || !email || !role || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the email is already in use by another user
    if (email !== user.email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: user._id },
      }); // Exclude the current user
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Update user fields
    user.name = name || user.name;
    user.role = role || user.role;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    // Hash the new password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        role: updatedUser.role,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
