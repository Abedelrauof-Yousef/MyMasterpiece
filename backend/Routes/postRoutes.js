const express = require('express');
const router = express.Router();
const postController = require('../Controllers/postController');
const auth = require('../Middleware/userAuth');

router.post('/', auth, postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.put('/:id', auth, postController.updatePost);
router.delete('/:id', auth, postController.deletePost);

module.exports = router;