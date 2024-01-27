const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req,res){
    let posts = await Post.find({}).populate('user').populate({
        path: 'comments',
        populate : {
            path: 'user'
        }
    })
    return res.status(200).json({
        message : "List of Posts",
        posts : posts
    })
}

module.exports.deletePost = async function(req,res){
    
    try {
        console.log(req.params);
        let post = await Post.findById(req.params.id);
        console.log(post.user);
        console.log(req.user);
        console.log(req.user.id);
        if(post.user == req.user.id){
            await Comment.deleteMany({post:req.params.id});
            await Post.findByIdAndDelete(req.params.id);
            return res.status(200).json({
                data:{
                    post_id : req.params.id
                },
                message: "Successfully deleted the post and comments assosicated"
            })
        }else{
            return res.status(401).json({
                message : "You can't delete this post"
            })
        }
        

    } catch (error) {
        console.log("Error",error);
        return res.status(500).json({
            message : "Internal server error"
        })
    }
}