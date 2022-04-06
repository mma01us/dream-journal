// routes that apply to logged in users
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Section = mongoose.model('Section');
const Dream = mongoose.model('Dream');

router.get('/profile', (req, res) => {
  // if not logged in, redirect to index.js
  res.redirect('/');
  // else, parse the user and display their data
});

module.exports = router;
