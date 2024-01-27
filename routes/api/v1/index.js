const express = require('express')
const router = express.Router();
console.log("v1 router loaded");

router.use('/posts',require('./posts'));
router.use('/users',require('./users'));
module.exports = router;