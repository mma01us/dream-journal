require('./db');

const express = require('express');
const path = require('path');
const config = require('./config'); // convict config

const routes = require('./routes/index'); // applies to all routes
const profile = require('./routes/profile'); // routes for logged in user

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// enable sessions
const session = require('express-session');
//const sessionOptions = {}; // TODO: FINISH THIS
//app.use(session(sessionOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// make user data available to all templates
// app.use((req, res, next) => {
//   res.locals.user = req.user;
//   next();
// });

app.use('/', routes);
app.use('/profile', profile);

// use var here so async callback gets value
var server = app.listen(config.get('port'), config.get('ip'), () => {
  const add = server.address();
  console.log('running on http://' + add.address + ':' + add.port);
});
