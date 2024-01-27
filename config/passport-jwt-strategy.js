const passport = require('passport');
const env = require('./environment');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
var opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : env.JWTsecretKey
}
passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    User.findById(jwt_payload._id).then(user=>{
        console.log(user);
        if(user){
            return done(null,user);
        }else{
            return done(null,false);
        }
    }).catch(err=>{
        if(err){
            console.log("Error in JWT",err);
            return;
        }
    })
}));

module.exports = passport;