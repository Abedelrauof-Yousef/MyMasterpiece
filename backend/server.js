const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
