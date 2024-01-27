//module.exports.actionName = function(req,res){}
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const Following = require('../models/following');
module.exports.home = async function(req, res) {
    try {
        let posts = await Post.find({}).populate('user').populate({
            path: 'comments',
            populate : {
                path: 'user'
            }
        })
        let following = await Following.find({from:req.user}).populate('to');
        let followers = await Following.find({to: req.user}).populate('from');
        let userdata = await User.find({});

        return res.render('home',{
            title: "SocioSphere",
            postData : posts,
            userList : userdata,
            followers : followers,
            following : following
        })
    } catch (error) {
        console.log("Error in home_controller",error);
    }
    

};



