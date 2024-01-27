const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const env = require('./environment');
const crypto = require('crypto');
const User = require('../models/user');

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: env.GoogleCallbackURL,
    scope: ['profile','email']
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({email : profile.emails[0].value}).then(user=>{
        if(user){
            return done(null,user);
        }else{
            User.create({
                name : profile.displayName,
                email : profile.emails,
                password : crypto.randomBytes(20).toString('hex')
            }).then(user=>{
                return done(null,user);
            }).catch(err=>{
                console.log("Error in creating a entry into db by googleAuth",err);
            })
        }
    }).catch(err=>{
        console.log("Error in Google Auth",err);
    })
  }
))

module.exports = passport;