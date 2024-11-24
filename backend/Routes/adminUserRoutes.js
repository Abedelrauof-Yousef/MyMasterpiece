// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  activateUser,
  deactivateUser,
} = require("../Controllers/adminUsersController");

// GET /api/users - Get all users
router.get("/", getAllUsers);

// PUT /api/users/:id/activate - Activate a user
router.put("/:id/activate", activateUser);

// PUT /api/users/:id/deactivate - Deactivate a user
router.put("/:id/deactivate", deactivateUser);


module.exports = router;
