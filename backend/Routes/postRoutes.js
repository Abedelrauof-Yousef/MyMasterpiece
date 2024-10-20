// routes/posts.js
const express = require('express');
const router = express.Router();
const postController = require('../Controllers/postController');
const auth = require('../Middleware/userAuth');
const upload = require('../Middleware/upload'); // Import multer middleware

// For creating a post with an image upload
router.post('/', auth, upload.single('picture'), postController.createPost);

// For updating a post with an optional image upload
router.put('/:id', auth, upload.single('picture'), postController.updatePost);

// Comments Routes
router.get('/:id/comments', postController.getComments); // Get comments for a post
router.post('/:id/comments', auth, postController.addComment); // Add a comment or reply to a post

// **New Routes for Editing and Deleting Comments**
router.put('/:postId/comments/:commentId', auth, postController.editComment); // Edit a comment
router.delete('/:postId/comments/:commentId', auth, postController.deleteComment); // Delete a comment

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.delete('/:id', auth, postController.deletePost);

module.exports = router;
