const express = require('express');
const passport = require('passport');
const router = express.Router();
const commentController = require('../controllers/comments_controller');
router.post('/new_comment',passport.checkAuthentication,commentController.newComment);
router.get('/delete_comment',passport.checkAuthentication,commentController.deleteComment);
module.exports = router;