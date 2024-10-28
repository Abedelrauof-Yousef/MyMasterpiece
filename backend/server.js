const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path"); // Import path module


require('./Sheduler/recurringTransactions')

app.use(
  cors({
    origin: "http://localhost:5173", // استبدل بعنوان النطاق المسموح به
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // السماح بطرق معينة
    allowedHeaders: ["Content-Type", "Authorization"], // السماح برؤوس معينة
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB setup
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;


// Mongoose connection without deprecated options
mongoose
  .connect(uri) // Deprecated options removed
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));


  
app.use("/api/users", require("./Routes/userRoutes"));
app.use("/api", require("./Routes/contactRoutes"));
app.use("/api/posts", require("./Routes/postRoutes"));

app.use("/api/transactions", require("./Routes/transactionRoutes"));
app.use("/api/goals", require("./Routes/goalRoutes"));
app.use("/api/payments", require("./Routes/paymentRoutes"));


// Admin Routes
app.use("/api/admin/users", require("./Routes/adminUserRoutes"));
app.use("/api/admin/posts", require("./Routes/adminPostRoutes"));
app.use("/api/admin/contact", require("./Routes/adminContactRoutes"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
