const Post = require("../Models/post");
const mongoose = require("mongoose");
const path = require("path");

exports.createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    let picture = "";

    if (req.file) {
      // Assuming your server serves static files from the 'uploads' directory
      picture = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    const newPost = new Post({
      user: req.user.id,
      picture,
      title,
      description,
    });
    await newPost.save();

    // Populate the 'user' field with 'username' and 'avatar'
    const populatedPost = await Post.findById(newPost._id).populate(
      "user",
      "username avatar"
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username avatar") // Populate 'user' field with 'username' and 'avatar'
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "username avatar"
    ); // Populate 'user' field
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res
      .status(500)
      .json({ message: "Error fetching post", error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, description } = req.body;
    let picture = "";

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "User not authorized" });
    }

    if (req.file) {
      // If a new picture is uploaded, update the picture URL
      picture = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
      post.picture = picture;
    }

    post.title = title;
    post.description = description;
    post.updatedAt = Date.now();

    await post.save();

    // Populate the 'user' field with 'username' and 'avatar'
    const populatedPost = await Post.findById(post._id).populate(
      "user",
      "username avatar"
    );

    res.json(populatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating post", error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    console.log("=== DELETE POST REQUEST RECEIVED ===");
    console.log("User ID from req.user:", req.user.id);
    console.log("Post ID from params:", req.params.id);

    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid post ID format.");
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Attempt to find the post by ID
    const post = await Post.findById(id);
    console.log("Fetched Post:", post);

    if (!post) {
      console.log("Post not found.");
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the requesting user is the owner of the post
    if (post.user.toString() !== req.user.id) {
      console.log("User not authorized to delete this post.");
      return res.status(403).json({ message: "User not authorized" });
    }

    // Attempt to delete the post using findByIdAndDelete
    const deletedPost = await Post.findByIdAndDelete(id);
    console.log("Post successfully deleted:", deletedPost);

    res.json({ message: "Post removed" });
  } catch (error) {
    console.error("=== ERROR DELETING POST ===");
    console.error("Error Details:", error);
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};
