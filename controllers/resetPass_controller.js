const User = require('../models/user');
const ResetPassword = require('../models/reset_password');
const resetPassMails = require('../mailers/resetPass_mailer');

module.exports.reset = function(req,res){
    return res.render('reset',{
        title : 'Reset Password'
    });
}

module.exports.resetForm = async function(req,res){
    try {
        let user = await User.findOne({email : req.body.email});
        if(!user){
            req.flash('error','Email is not existing');
            return res.redirect('back');
        }
        console.log(user);
        let recrePass = await ResetPassword.create({
            user : user.id
        })
        console.log("Successfully sent a mail",recrePass);
        resetPassMails.newResetPassLink(user.email,user.name, recrePass.accessToken);
        req.flash('success','Password change link has been sent to your email, please checkout!');
    } catch (error) {
        console.log("Error in recre",error);
    }
    return res.redirect('back');
}

module.exports.resetPassword = async function(req,res){
    let resetPassCheck = await ResetPassword.findOne({accessToken : req.params.key});
    if(resetPassCheck){
        req.flash('success','Directing to the changing the password page');
        return res.render('reset_password',{
            title : 'Reset Password',
            key : req.params.key
        });
    }else{
        req.flash('error','Either session timedout or link is correct')
        return res.redirect('/users/reset');
    }
    
    
}


module.exports.resetPasswordForm = async (req,res)=>{
    try {
        if(req.body.new_pass == req.body.confirm_new_pass){
            console.log(req.params);
            let resetPassCheck = await ResetPassword.findOne({accessToken : req.params.key});
            if(!resetPassCheck){
                req.flash('error',"Either session timed out or used already");
                return res.redirect('/users/reset');
            }
            console.log(resetPassCheck);
            let user = await User.findById(resetPassCheck.user);
            console.log(user);
            user.password = req.body.new_pass;
            let r = await ResetPassword.findOneAndDelete({accessToken : req.params.key});
            console.log(r);
            await user.save();
            req.flash('success','Password has been successfully reseted');
        }
    } catch(error) {
        console.log("Error occucured while reseting the password",error);
    }
    return res.redirect('/users/signin');
}

