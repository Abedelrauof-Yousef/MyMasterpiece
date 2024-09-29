const express = require("express");
const router = express.Router();
const { contact } = require("../Controllers/contactController")
const auth = require("../Middleware/userAuth");


router.post("/contact",auth, contact);


module.exports = router;