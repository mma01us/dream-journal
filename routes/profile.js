// routes that apply to logged in users
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Section = mongoose.model('Section');
const Dream = mongoose.model('Dream');

router.get('/', (req, res) => {
  if(req.session.user){
    if(req.session.data.calendar){
      res.render('profile-calendar', {title: "Dream Journal - Calendar"});
    } else {
      res.render('profile-list', { title: "Dream Journal - List" });
    }
  } else {
    res.redirect('/');
  }
});

module.exports = router;
