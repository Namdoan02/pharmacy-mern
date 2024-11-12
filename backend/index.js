const express = require("express");
const cors = require("cors"); // Import the database connection function
const authRouter = require('./router/authRouter.js');
const userRouter = require('./router/userRouter.js') // Import the auth router
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file
const PORT = 5000;
const app = express(); // Initialize app before using it
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173", // Specific frontend URL
  credentials: true, // Allow cookies and credentials
};
// Middleware
app.use(cors(corsOptions)); // Enable CORS
app.use(express.json()); // Parse JSON data

// Connect to the database
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Database connected!");
}).catch((err) => {
  console.log(err);
});
 

app.use("/api/auth/", authRouter);
app.use("/api/users", userRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
