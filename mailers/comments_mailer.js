const nodemailer = require('../config/nodemailer');

module.exports.newComment = (email,name,comment)=>{
    console.log("inside new Comment mailer");
    let htmlString = nodemailer.renderTemplate({
        comment : comment,
        name: name
    },'/new_comment.ejs');
    nodemailer.transporter.sendMail({
        from : 'sainisshith@gmail.com',
        to: email,
        subject : `${name} has made a comment to your post`,
        html : htmlString
    }).then(info=>{
        console.log("Message send", info);
        return;
    }).catch(err =>{
        if(err){
            console.log("Error occured",err);
        }
    })
}