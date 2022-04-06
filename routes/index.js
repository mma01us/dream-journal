// routes that apply to entire webpage
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/', (req, res) => {
  // if logged in, redirect to /profile
  if(req.session.user){
    res.redirect('profile');
  } else {
    res.render('index', {title: "Dream Journal - Home"});
  }
});

router.get('/register', (req, res) => {
  if(req.session.user){
    res.redirect('profile');
  } else {
    res.render('register', {title: "Dream Journal - Register"});
  }
});

router.get('/login', (req, res) => {
  // if logged in, redirect to /profile
  if(req.session.user){
    res.redirect('profile');
  } else {
    res.render('login', {title: "Dream Journal - Login"});
  }
});

router.post('/register', (req, res) => {
  // parse user. if invalid, render register with err msg, else log user in, then redirect to profile
  // check inputs
  // clean up
  const username = req.body.dreamuname;
  const pass = req.body.dreampass;
  const confirm = req.body.dreampassconfirm;
  let err1, err2, err3;
  if(!username || !pass || !confirm){
    if(!username || username.match(/^[a-zA-Z0-9]+$/) !== null){
      err1 = 'Must enter a valid username';
    }
    if(!pass){
      err2 = 'Must enter a valid password';
    }
    if(!confirm){
      err3 = 'Must enter a valid matching password';
    }
  } else if(pass != confirm){
    err3 = 'Must enter matching passwords';
  }

  if(err1 || err2 || err3){
    console.log(err1, err2, err3);
    res.render('register', { title: "Dream Journal - Login", err1: err1, err2: err2, err3: err3});
  } else {
    const newUser = {
      username: username,
      pass: pass,
      theme: 0,
      calendar: false,
      dreams:  [] // maybe add a default dream that's a tutorial page
    };

    new User(newUser).save(function(err, cat, count){
      if(err){
        // failure - check if username already exists
        if (err.code && err.code === 11000) {
          res.render('register', { title: "Dream Journal - Login", err1: 'Username already exists!'});
        } else {
          console.log(err);
          res.render('register', { title: "Dream Journal - Login", err4: 'Unknown error. Check logs.'});
        }
      } else {
          // success!
          req.session.user = username;
          res.redirect('/');
      }
    });
  }
});

router.post('/login', (req, res) => {
  // if user is valid login, else, render login again with err msg
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  // logout and send to index
  req.session.user = null;
  res.locals.loggedIn = false;
  res.redirect('/');
});

module.exports = router;
