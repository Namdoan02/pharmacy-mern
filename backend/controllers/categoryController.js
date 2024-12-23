const Category = require("../models/categoryModel"); // Import the Category model
const mongoose = require("mongoose");

// Create a new category
const createCategory = async (req, res) => {
  const { name, description } = req.body;

  // Check if all required fields are provided
  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Name and description are required" });
  }

  try {
    // Check if the category name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category name already exists" });
    }

    // Create a new category
    const newCategory = new Category({
      name,
      description,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json({
      message: "Category created successfully",
      data: savedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve categories",
      error: error.message,
    });
  }
};
// Update a category by ID
const updateCategory = async (req, res) => {
  const { id } = req.params; // Category ID
  const { name, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name || category.name;
    category.description = description || category.description;

    const updatedCategory = await category.save();
    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update category", error });
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category", error: error.message });
  }
};
const searchCategories = async (req, res) => {
  try {
    const { search } = req.query;

    const categories = await Category.find({
      name: { $regex: search, $options: "i" },
    });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi tìm kiếm danh mục thuốc", error });
  }
};
module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  searchCategories,
};
