const mongoose = require("mongoose");

// Define the schema for categories
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true }, 
  },
  { timestamps: true }
);

// Export the model
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
