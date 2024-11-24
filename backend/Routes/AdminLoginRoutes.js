// routes/postRoutes.js

const express = require("express");
const router = express.Router();
const {
  login,
} = require("../Controllers/adminLoginController");


router.post("/", login);


module.exports = router;
