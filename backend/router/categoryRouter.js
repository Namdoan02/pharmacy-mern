const express = require("express");
const cors = require("cors");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");


router.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
router.post("/create", createCategory);
router.get("/categories", getAllCategories);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

module.exports = router;
