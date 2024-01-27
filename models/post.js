const mongoose = require('mongoose');

//for maintaing the created at and updated at we make timestamps: true
const postSchema = new mongoose.Schema({
   content: {
    type: String,
    required: true,
   } ,
   user: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
   },
   comments:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
   }],
   likes : [{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Like'
   }]
},{
    timestamps: true
})

const Post = mongoose.model('Post',postSchema);
module.exports = Post;