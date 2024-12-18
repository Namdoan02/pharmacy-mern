const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  auth,
  loginUser,
  getProfile,
} = require("../controllers/authcontroller.js");
router.use(
  cors({
    origin: ["http://localhost:5173","https://pharmacy-mern-kczg.onrender.com"],
    credentials: true,
  })
);
router.get("/", auth);
router.post("/login", loginUser);
router.get("/profile", getProfile);




module.exports = router;
