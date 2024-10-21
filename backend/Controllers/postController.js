const Post = require("../Models/post");
const mongoose = require("mongoose");
const path = require("path");
const Comment = require("../Models/comment");

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




// Add a Comment or Reply to a Post
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    const { content, parentId } = req.body; // parentId is optional

    console.log("Adding comment to Post ID:", id);
    console.log("Comment Content:", content);
    console.log("Parent Comment ID:", parentId);

    // Validate content
    if (!content || content.trim() === "") {
      console.error("Content is required.");
      return res.status(400).json({ message: "Content is required" });
    }

    // Validate Post ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid post ID format.");
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(id);
    if (!post) {
      console.error("Post not found.");
      return res.status(404).json({ message: "Post not found" });
    }

    let parentComment = null;
    if (parentId) {
      // Validate Parent Comment ID
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        console.error("Invalid parent comment ID format.");
        return res.status(400).json({ message: "Invalid parent comment ID" });
      }

      parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        console.error("Parent comment not found.");
        return res.status(404).json({ message: "Parent comment not found" });
      }

      // Check if parent is a reply (i.e., it has a parent itself)
      if (parentComment.parent) {
        console.error("Cannot reply to a reply. Only top-level comments can be replied to.");
        return res.status(400).json({ message: "Cannot reply to a reply. Only top-level comments can be replied to." });
      }
    }

    const newComment = new Comment({
      post: id,
      user: req.user.id,
      content: content.trim(),
      parent: parentId || null,
    });

    await newComment.save();

    const populatedComment = await Comment.findById(newComment._id)
      .populate("user", "username avatar")
      .populate("parent", "content user"); // Populate parent comment if applicable

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

// Get Comments (including replies) for a Post
exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching comments for Post ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid post ID format.");
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Fetch top-level comments
    const comments = await Comment.find({ post: id, parent: null })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    // For each top-level comment, fetch its replies
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parent: comment._id })
          .populate("user", "username avatar")
          .sort({ createdAt: 1 }); // Older replies first
        return { ...comment.toObject(), replies };
      })
    );

    res.json(commentsWithReplies);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};



// Edit Comment
exports.editComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { content } = req.body;

    console.log(`Editing Comment ID: ${commentId} on Post ID: ${postId}`);

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(postId) ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      console.error("Invalid Post ID or Comment ID format.");
      return res.status(400).json({ message: "Invalid Post ID or Comment ID" });
    }

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      console.error("Comment not found.");
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the comment belongs to the specified post
    if (comment.post.toString() !== postId) {
      console.error("Comment does not belong to the specified post.");
      return res.status(400).json({ message: "Comment does not belong to the specified post." });
    }

    // Check if the user is authorized to edit the comment
    if (comment.user.toString() !== req.user.id) {
      console.error("User not authorized to edit this comment.");
      return res.status(403).json({ message: "User not authorized to edit this comment." });
    }

    // Validate content
    if (!content || content.trim() === "") {
      console.error("Content is required.");
      return res.status(400).json({ message: "Content is required." });
    }

    // Update the comment
    comment.content = content.trim();
    comment.updatedAt = Date.now();
    await comment.save();

    // Populate user field
    const updatedComment = await Comment.findById(commentId).populate("user", "username avatar");

    res.json(updatedComment);
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).json({ message: "Error editing comment", error: error.message });
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    console.log(`Deleting Comment ID: ${commentId} from Post ID: ${postId}`);

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(postId) ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      console.error("Invalid Post ID or Comment ID format.");
      return res.status(400).json({ message: "Invalid Post ID or Comment ID" });
    }

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      console.error("Comment not found.");
      return res.status(404).json({ message: "Comment not found." });
    }

    // Check if the comment belongs to the specified post
    if (comment.post.toString() !== postId) {
      console.error("Comment does not belong to the specified post.");
      return res.status(400).json({ message: "Comment does not belong to the specified post." });
    }

    // Check if the user is authorized to delete the comment
    if (comment.user.toString() !== req.user.id) {
      console.error("User not authorized to delete this comment.");
      return res.status(403).json({ message: "User not authorized to delete this comment." });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    // If it's a parent comment, delete its replies
    if (!comment.parent) {
      await Comment.deleteMany({ parent: commentId });
      console.log(`Deleted all replies for Comment ID: ${commentId}`);
    }

    res.json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};