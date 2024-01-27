const nodemailer = require('../config/nodemailer');

module.exports.newResetPassLink = (email,name,key)=>{
    console.log("inside new Comment mailer");
    let htmlString = nodemailer.renderTemplate({
        name: name,
        key : key
    },'/reset_pass.ejs');
    nodemailer.transporter.sendMail({
        from : 'sainisshith@gmail.com',
        to: email,
        subject : `Password Reset Request!!!`,
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