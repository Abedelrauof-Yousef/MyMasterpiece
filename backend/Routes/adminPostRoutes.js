// routes/postRoutes.js

const express = require("express");
const router = express.Router();
const {
  getPendingPosts,
  approvePost,
  denyPost,
  getAllPosts,
  getAllManagedPosts,
  deletePost,
} = require("../Controllers/adminPostController");

// GET /api/posts/pending - Get all pending posts
router.get("/pending", getPendingPosts);

// PUT /api/posts/:id/approve - Approve a post
// router.put("/:id/approve", approvePost);
router.post("/update-approve", approvePost);
router.post("/deny-posts", denyPost);

// PUT /api/posts/:id/deny - Deny a post
router.put("/:id/deny", denyPost);

// GET /api/posts - Get all approved and denied posts
router.get("/", getAllPosts);
router.get("/get-managed-posts", getAllManagedPosts);

// DELETE /api/posts/:id - Delete a post
router.delete("/:id", deletePost);

module.exports = router;
