const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  auth,
  loginUser,
  getProfile,
} = require("../controllers/authcontroller.js");
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
router.get("/", auth);
router.post("/login", loginUser);
router.get("/profile", getProfile);


router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users/create", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
