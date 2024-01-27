const Post = require('../models/post');
const User = require('../models/user');
const Comment =require('../models/comment');
const Like = require('../models/like');
module.exports.newpost = async function(req,res){
    if(!req.body.content){
        console.log("You didn't entered any data content");
        req.flash('error','The post info is blank');
        return res.redirect('/')
    }
    try{
        let post = await Post.create({
            content : req.body.content,
            user : req.user._id
        });
        let date = new Date(post.createdAt);
        let full = date.getDate() + "-" + (date.getMonth()+1)+ "-"+date.getFullYear() + "  "+ date.getHours()+":"+date.getMinutes();
        if(req.xhr){
            
            return res.status(200).json({
                data: {
                    post : post,
                    user : req.user,
                    date: full
                },
                message: "Post Created"
            })
        }
        

        req.flash('success','Post is published');
        return res.redirect('/');
    }catch(err){
        console.log("Error Occured in creating a new Post " , err);
        return res.redirect('/');
    }
    
}
module.exports.deletePost = async function(req,res){
    
    try {
        console.log(req.params);
        let post = await Post.findById(req.params.id);
        if(req.xhr && !post){
            return res.status(409).json({
                message:"Requests are conflicting"
            })
        }
        if(req.user.id ==post.user){
            await Comment.deleteMany({post:req.params.id});
            await Like.deleteMany({likeable : req.params.id});
            await Post.findByIdAndDelete(req.params.id);
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id : req.params.id
                    },
                    message: "Successfully deleted the post"
                })
            }
            req.flash('success','Post is deleted');
        }else{
            if(req.xhr){
                return res.status(403).json({
                    message: "You are not authorized to Delete this post"
                })
            }
        }
        return res.redirect('/');

    } catch (error) {
        req.flash('error','Post cant be deleted');
        console.log("Error",error);
    }
}