const express = require("express");
const router = express.Router();
const auth = require("../Middleware/userAuth");
const { createOrder, captureOrder } = require("../Controllers/paymentController");

router.post("/create-order", auth, createOrder);
router.post("/capture-order", auth, captureOrder);

module.exports = router;
