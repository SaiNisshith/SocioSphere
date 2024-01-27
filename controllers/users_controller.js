const User = require('../models/user');
const Post = require('../models/post');
const Follow = require('../models/following');
const fs = require('fs');
const path = require('path');

module.exports.profile = async function(req,res){
    try {
        let data = await User.findById(req.params.id);
        let following = await Follow.findOne({from: req.user.id,to:req.params.id});
        let follower = await Follow.findOne({from:req.params.id,to:req.user.id});
        console.log("Following" ,following);
        console.log("Follower",follower);
        
        return res.render('users',{
            title: "Profile page",
            profile_data: data,
            following : following,
            follower : follower
        })
    } catch (error) {
        console.log("Error occured while showing profile",err);
        return res.redirect('/');
    }
    
    
    // let id = req.cookies.user_id;
    // User.findById(id).then(data =>{
    //     if(!data){
    //         console.log("Not matching");
    //         return res.redirect('/users/signin');
    //     }else{
    //         console.log("Matched");
    //         return res.render('users',{
    //             title : "Profile",
    //             name : data.name,
    //             email : data.email
    //         })
    //     }
    // }).catch(err=>{
    //     console.log("Error Authenticating");
    // })
}

//render the signin page
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
       return res.redirect('/');
    }
    return res.render('user_sign_in',{
        title : "SocioSphere | Signin"
    })
}

//render the signup page
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/');
     }
    if(req.body)
    return res.render('user_sign_up',{
        title : "SocioSphere | Signup"
    })
}

//get the signUp data
module.exports.create = function(req,res){
    // console.log(req.body);
    if(req.body.password !=req.body.confirm_password){
        return res.redirect('/users/signup');
    }
    User.findOne({email : req.body.email}).then((data)=>{
        if(!data){
            User.create({
                email : req.body.email,
                password : req.body.password,
                name : req.body.name
            }).then((data)=>{
                console.log("Successfully Created");
                console.log(data);
            }).catch((err)=>{
                console.log("Error in inserting", err);
            })
            return res.redirect('/users/signin');
        }else{
            return res.redirect('/users/signup');
        }
    }).catch(err =>{
        console.log("Error occured")
    })
}

//sign in and create a session
module.exports.createSession = function(req,res){

    //Manual Auth
    // User.findOne({
    //     email : req.body.email,
    //     password : req.body.password
    // }).then(function(data){
    //     if(!data){
    //         console.log("User/Password is incorrect");
    //         return res.redirect('back');
    //     }else{
    //         res.cookie('user_id',data.id);
    //         return res.redirect('/users/profile');
    //     }
    // }).catch(err => {
    //     console.log("Error signing in", err);
    // })
    req.flash('success', 'Logged in Successfully!')
    return res.redirect('/');
    
}


module.exports.signout = function(req,res){
    // console.log(req.cookies);
    // const cookies = Object.keys(req.cookies);

    // cookies.forEach(cookieName => {
    //     res.clearCookie(cookieName);
    // });
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'Logged out Successfully!');
        res.redirect('/');
      });
}



module.exports.editInfo = async function(req,res){
    // User.findOneAndUpdate(req.user.id).then(data=>{
    //     data.email = req.body.email,
    //     data.name = req.body.name
    //     data.save();
    //     req.flash('success','Updated Successfully')
    //     // console.log(data);
    // }).catch(err=>{
    //     console.log("Unable to edit",err);
    //     req.flash('error','Unauthorized');
    // })
    // res.redirect('/');
    if(req.user.id == req.params.id){
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log("Error in Multer",err);
                }
                console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;
                console.log(path.join(__dirname,'../uploads/users/avatars'));
                if(req.file){
                    if(user.avatar){
                        
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                    //this is saving the path of the uploaded file into the avata field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename ;
                }
                user.save();
            })
            req.flash('success',"Successfully updated your profile");
        } catch (error) {
            console.log("Unable to edit",err);
            req.flash('error','Unauthorized');
        }
    }
    res.redirect('back');
}

module.exports.follow = async function(req,res){
    try {
        console.log(req.query);
        let follow = await Follow.find({from: req.query.from,to:req.query.to});
        console.log(follow);
        if(follow.length){
            let del = await Follow.deleteOne({from: req.query.from,to:req.query.to});
        }else{
            let k = await Follow.create({from: req.query.from,to:req.query.to});
            console.log(k);
        }
        return res.redirect('/');
    } catch (error) {
        console.log("Error in users controller - follow");
    }
    
}
