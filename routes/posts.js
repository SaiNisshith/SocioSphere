const express = require('express');
const passport = require('passport');
const router = express.Router();
const postController = require('../controllers/posts_controller');
router.post('/new_post',passport.checkAuthentication,postController.newpost);
router.get('/deletepost/:id',passport.checkAuthentication,postController.deletePost);

module.exports = router;