const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');
module.exports.createSession = async function(req,res){
    try {
        let user = await User.findOne({email: req.body.email});
        if(!user || user.password!=req.body.password){
            return res.status(422).json({
                message : "Invalid username/password"
            })

        }
        return res.status(200).json({
            message : "Sign In successful, here is your token, please keep it safe",
            data : {
                token : jwt.sign(user.toJSON(),env.JWTsecretKey,{expiresIn: '1000000'})
            }
        })
    } catch (error) {
        console.log("Error in JWT", error);
        return res.status(500).json({
            message : "Internal Server Error in JWT"
        })
    }
    
    
}