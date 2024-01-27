const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const Like = require('../models/like');
const commentsMails = require('../mailers/comments_mailer');
const commentsEmailWorkers = require('../workers/comment_email_worker');
const queue = require('../config/kue');
module.exports.newComment = async function(req,res){
    console.log(req.body);
    try {
        let post = await Post.findById(req.body.post_id).populate('user');
        if(!req.body.content){
            console.log("You have not entered any Comment data");
            return res.redirect('/');
        }
        let comment = await Comment.create({
            content: req.body.content,
            user : req.user._id,
            post : req.body.post_id
        });
        // console.log(post);
        post.comments.push(comment);
        await post.save();
        if(post.user.email != req.user.email){
            // commentsMails.newComment(post.user.email,req.user.name,comment);
            let job = queue.create('emails',{email : post.user.email, name : req.user.name, comment :comment}).save(function(err){
                if(err){
                    console.log("Err",err);
                }
                console.log('Job queued',job.id);
            })
        }
        
        let date = new Date(comment.createdAt);
            let full = date.getDate() + "-" + (date.getMonth()+1)+ "-"+date.getFullYear() + "  "+ date.getHours()+":"+date.getMinutes();    
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment : comment,
                        post : post,
                        user : req.user,
                        date : full
                    },message : "Comment is published"
                })
            }
        return res.redirect('/');
    } catch (err) {
        console.log("Error in posting a comment",err)
    }
}



module.exports.deleteComment = async function(req,res){
    try {
        console.log(req.query);
        let data = await Comment.findById(req.query.id);
        console.log(data);
        if(req.user.id == data.user || req.user.id == req.query.postUid){
            let postId = data.post;
            await Post.findByIdAndUpdate(postId,{$pull :{comments:req.query.id}});
            await Like.deleteMany({likeable : req.query.id});
            await Comment.findByIdAndDelete(req.query.id);
            
            if(req.xhr){
                return res.status(200).json({
                    data : {
                        commentId : req.query.id
                    },message: "Comment is deleted"
                })
            }
        } 
        return res.redirect('/');
    } catch (error) {
        console.log("Error occured in deleting", error);
    }
}
