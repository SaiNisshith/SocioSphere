const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');

const cookie = require('cookie-parser');
const sassMiddleware = require('node-sass-middleware');
const customMiddleWare = require('./config/middleware');
const app = express();
require('./config/view-helpers')(app);
const port = 8000;
const path = require('path');



var expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

//used for session cookies
const session = require('express-session');
const passport = require('passport');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
//Connect Mongo is used for not logging off the user whenever the servr get restarted
const MongoStore = require('connect-mongo');
var flash = require('connect-flash');


//setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);


chatServer.listen(5000, (err) => {
    if(err){
        console.log("Error in chat server",err)
    }
    console.log('chat server listening on *:5000');
  });

if(env.name=='development'){
    app.use(sassMiddleware({
        /* Options */
        src: path.join(__dirname,env.asset_path,'scss'),
        dest: path.join(__dirname,env.asset_path,'css'),
        debug: true,
        outputStyle: 'compressed',
        prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
    }));
}


app.use(express.static(env.asset_path));
//need to add this before routes as they gets assosiated with all the layouts
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookie());
//make the uploads available to the browser
app.use('/uploads',express.static(__dirname+'/uploads'))

app.use(logger(env.morgan.mode,env.morgan.options));


//set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name: 'SocioSphere',
    //Change the Secret
    secret: env.session_cookie_key,
    saveUninitialized : false,
    resave : false,
    cookie :{
        maxAge : (1000*60*100)
    },
    store: MongoStore.create({ mongoUrl: `mongodb://127.0.0.1:27017/${env.db}` })
}))


//extract style and scripts from sub pages into the layout
app.set("layout extractStyles",true);
app.set("layout extractScripts", true);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMiddleWare.setFlash);

//use express router

app.use('/',require('./routes/index'));

app.listen(port, (err) => {
    if(err){
        console.log(`Error in running the server: ${err}`);
        return;
    }
    console.log(`Example app listening on port ${port}`);
  })
