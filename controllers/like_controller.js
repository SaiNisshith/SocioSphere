const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.toggleLike = async function(req,res){
    try {
        // likes/toggle/?id=&type=
        let likeable;
        let deleted =false;
        if(req.query.type=='Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }
        let existingLike = await Like.findOne({
            user: req.user.id,
            onModel : req.query.type,
            likeable : req.query.id
        });
        
        if(existingLike){
            //delete it
            likeable.likes.pull(existingLike._id);
            await likeable.save();
            await Like.findByIdAndDelete(existingLike._id);
            deleted = true
        }else{
            let newLike = await Like.create({
                user : req.user.id,
                likeable : req.query.id,
                onModel : req.query.type
            })
            likeable.likes.push(newLike);
            await likeable.save();
            deleted = false
        }
        return res.status(200).json({
            message: "Request Successful",
            data : {
                deleted : deleted
            }
        })
    } catch (error) {
        console.log("Error in Like action",error);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}