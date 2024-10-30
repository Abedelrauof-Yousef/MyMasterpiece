// controllers/AdminPostController.js

const Post = require("../Models/post");
const User = require("../Models/users");

// Get all pending posts
const getPendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isAprroved: false }).populate(
      "user",
      "username email"
    );
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching pending posts:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Approve a post
const approvePost = async (req, res) => {
  // console.log("inside approvePost controller");

  const { id } = req.body;

  // console.log(id);
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      { isAprroved: true },
      { new: true }
    ).populate("user", "username email");

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.status(200).json({
      success: true,
      data: post,
      message: "Post approved successfully",
    });
  } catch (error) {
    console.error("Error approving post:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Deny a post
const denyPost = async (req, res) => {
  const { id } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      { isAprroved: false },
      { new: true }
    ).populate("user", "username email");

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res
      .status(200)
      .json({ success: true, data: post, message: "Post denied successfully" });
  } catch (error) {
    console.error("Error denying post:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all approved and denied posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      status: { $in: ["approved", "denied"] },
    }).populate("user", "username email");
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching all posts:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// Get all approved and denied posts
const getAllManagedPosts = async (req, res) => {
  try {
    console.log("inside getAllManagedPosts controller");
    const posts = await Post.find().populate("user", "username email");
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching all posts:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getPendingPosts,
  approvePost,
  denyPost,
  getAllPosts,
  getAllManagedPosts,
  deletePost,
};
