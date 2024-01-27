const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStreams = rfs.createStream("access.log", {
  size: "10M", // rotate every 10 MegaBytes written
  interval: "1d", // rotate daily
  compress: "gzip", // compress rotated files,
  path: logDirectory
});

const development = {
    name : 'development',
    asset_path : './assets',
    session_cookie_key :'blahsomething',
    db: 'SocioSphere_Dev',
    smtp : {
        service : 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "sainisshith@gmail.com",
          pass: "izht vfno avnp clku",
        },
      },
    GOOGLE_CLIENT_ID : "77512752449-iafedi6p6upbtchisbqn8efnd3150b0u.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET : "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",
    GoogleCallbackURL: "http://localhost:8000/users/auth/google/callback",
    JWTsecretKey : 'SocioSphere',
    morgan : {
      mode : 'dev',
      options : {
        stream : accessLogStreams
      }
    }

}

const production = {
    name : 'production',
    asset_path : process.env.SOCIOSPHERE_ASSET_PATH,
    session_cookie_key :process.env.SOCIOSPHERE_SESSION_COOKIE_KEY,
    db: process.env.SOCIOSPHERE_DB,
    smtp : {
        service : 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.SOCIOSPHERE_GMAIL,
          pass: process.env.SOCIOSPHERE_GMAIL_PASSWORD,
        },
      },
    GOOGLE_CLIENT_ID : process.env.SOCIOSPHERE_GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET : process.env.SOCIOSPHERE_GOOGLE_CLIENT_SECRET,
    GoogleCallbackURL: process.env.SOCIOSPHERE_GoogleCallbackURL,
    JWTsecretKey : process.env.SOCIOSPHERE_JWT_SECRET,
    morgan : {
      mode : 'combined',
      options : {
        stream : accessLogStreams
      }
    }
}

module.exports = eval(process.env.SOCIOSPHERE_ENVIRONMENT)==undefined ? development : eval(process.env.SOCIOSPHERE_ENVIRONMENT);