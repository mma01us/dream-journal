// routes that apply to logged in users
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Section = mongoose.model('Section');
const Dream = mongoose.model('Dream');

// TODO: fully correct and dynamic implementation of this so adding new themes is easy
const themeslist = ['Default', 'Dark', 'Sunset', 'City'];
const themes = themeslist.map(theme => { return { val: themeslist.indexOf(theme), name: theme }; });

// TODO: add middleware to check if logged in

router.get('/', (req, res) => {
  if(req.session.user){
    let msg = "";
    console.log(req.session.data);
    switch(req.session.data.theme){
      case 0:
        msg = "You've selected the default theme.";
        break;
      case 1:
        msg = "You've selected the dark theme.";
        break;
      case 2:
        msg = "You've selected the sunset theme.";
        break;
      case 3:
        msg = "You've selected the city theme.";
        break;
      default:
        msg = "You've selected an invalid theme, which is automatically default.";
        break;
    }

    if(req.session.data.calendar){
      res.render('profile-calendar', {title: "Dream Journal - Calendar", theme: msg});
    } else {
      res.render('profile-list', { title: "Dream Journal - List", theme: msg});
    }
  } else {
    res.redirect('/');
  }
});

router.get('/settings', (req, res) => {
    if(req.session.user){
      const selected = { val: req.session.data.theme, name: themeslist[req.session.data.theme] };
      const unselected = themes.filter(theme => theme.val !== selected.val);
      console.log(themes);
      res.render('settings', { title: "Dream Journal - Settings", selected: selected, themes: unselected});
    } else {
      res.redirect('/');
    }
});

router.post('/settings', (req, res) => {
    if(req.session.user){
      // cleanup
      const calendar = isNaN(req.body.mode) ? req.session.data.calendar : parseInt(req.body.mode) === 1;
      const theme = isNaN(req.body.theme) ? 0 : parseInt(req.body.theme);

      // save values
      const query = {username: req.session.user};
      const update = {calendar: calendar, theme: theme};

      User.updateOne(query, update, function (err, docs) {
          if (err){
              console.log("Error updating user", err);
          }
          else{
              console.log("Updated User: ", update);
          }
      });

      //update locally
      req.session.data.calendar = calendar;
      req.session.data.theme = theme;
      res.locals.user = req.session.data;

      console.log(themes);
      res.redirect('/');
    } else {
      res.redirect('/'); // profile then redirects to index
    }
});

module.exports = router;
