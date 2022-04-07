require('./db');

const express = require('express');
const exphbs  = require('express-handlebars');
const path    = require('path');
const config  = require('./config'); // convict config

const routes = require('./routes/index'); // applies to all routes
const profile = require('./routes/profile'); // routes for logged in user

const crypto = require('crypto'); // for some randomization and security

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
  defaultLayout: 'layout',
  extname: '.hbs',
  helpers: require('./utility/hbs-helpers'),
  partialsDir: "views/partials/",
  layoutsDir: "views/"
}));
app.set('view engine', 'hbs');

// enable sessions
const session = require('express-session');
const sessionSecret = crypto.randomBytes(20).toString('hex');
console.log("Secret selected as", sessionSecret);
const sessionOptions = {
	secret: sessionSecret, // random base64 string
	saveUninitialized: false,
	resave: false
};
app.use(session(sessionOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// make user data available to all templates
 app.use((req, res, next) => {
   if(req.session.user){
     res.locals.loggedIn = true;
     res.locals.user = req.session.user;
   } else {
     res.locals.loggedIn = false;
   }
   next();
});

app.use('/', routes);
app.use('/profile', profile);

// change to use convict correctly here
const port = process.env.PORT || config.get('port');

// use var here so async callback gets value
var server = app.listen(config.get('port'), () => {
  const add = server.address();
  console.log('running on http://' + add.address + ':' + add.port);
});
