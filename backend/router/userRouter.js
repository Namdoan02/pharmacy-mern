const express = require("express");
const router = express.Router();
const cors = require("cors");
const User = require("../models/UserModel");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController.js");
router.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
  router.get("/check-email", async (req, res) => {
    const { email } = req.query;
    try {
      const user = await User.findOne({ email });
      if (user) {
        return res.json({ isUnique: false }); // Email exists
      }
      return res.json({ isUnique: true }); // Email does not exist
    } catch (error) {
      res.status(500).json({ message: "Error checking email" });
    }
  });
  router.post("/create", createUser);
  
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
