const express = require("express");
const cors = require("cors"); // Import the database connection function
const authRouter = require('./router/authRouter.js');
const userRouter = require('./router/userRouter.js')
const supplierRouter = require("./router/supplierRouter.js"); 
const categoryRouter = require("./router/categoryRouter.js");
const medicineRouter = require("./router/medicineRouter.js");
const customerRouter = require('./router/customerRouter.js');
const invoiceRoutes = require("./router/invoiceRoutes.js");
const path = require('path');


const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file
const PORT = 5000;
const app = express(); // Initialize app before using it
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const corsOptions = {
  origin: ["http://localhost:5173","https://pharmacy-mern-jqpu.onrender.com"], // Specific frontend URL
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
app.use("/api/suppliers", supplierRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/medicines", medicineRouter);
app.use('/api/customers', customerRouter);
app.use("/api/invoices", invoiceRoutes);

app.use(express.static(path.join(__dirname, "../fontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../fontend/dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
