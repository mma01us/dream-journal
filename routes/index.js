// routes that apply to entire webpage
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/', (req, res) => {
  // if logged in, redirect to /profile, else:
  res.render('index', {title: "Dream Journal - Home"});
});

router.get('/register', (req, res) => {
  // if logged in, redirect to /profile, else:
  res.render('register', {title: "Dream Journal - Register"});
});

router.get('/login', (req, res) => {
  // if logged in, redirect to /profile, else:
  res.render('login', {title: "Dream Journal - Login"});
});

router.post('/register', (req, res) => {
  // parse user. if invalid, render register with err msg, else log user in, then redirect to profile
  res.redirect('/');
});

router.post('/login', (req, res) => {
  // if user is valid login, else, render login again with err msg
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  // logout and send to index
  res.redirect('/');
});

module.exports = router;
