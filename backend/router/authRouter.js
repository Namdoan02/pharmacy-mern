const express = require ("express");
const router = express.Router();
const cors = require("cors");
const {auth,registerUser,loginUser,getProfile} = require("../controllers/authcontroller.js");

router.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));
router.get("/", auth);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);

module.exports = router;