// routes that apply to logged in users
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Dream = mongoose.model('Dream');
const greetingTime = require("greeting-time");

// TODO: fully correct and dynamic implementation of this so adding new themes is easy
const themeslist = ['default', 'dark', 'sunset', 'city'];
const themes = themeslist.map(theme => { return { val: themeslist.indexOf(theme), name: theme }; });
const moods = ['&#x1F610;', '&#x1F604;', '&#x1F641;', '&#x1F62D;'];
const greeting = greetingTime(new Date());

// TODO: add middleware to check if logged in

router.get('/', (req, res) => {
  if(req.session.user){
    console.log(req.session.data);
    const theme = themeslist[req.session.data.theme];

    if(req.session.data.calendar){
      res.render('profile-calendar', {title: "Dream Journal - Calendar", theme: theme, greeting: greeting});
    } else {
      const query = {user: req.session.data._id};
      Dream.find(query, function(err, data, count) {
        if(data.length > 0){
          const dreams = [];
          data.forEach(d => {
            const dream = {
              _id: d.slug,
              name: d.name,
              face: moods[d.mood],
              date: d.date.toLocaleDateString("en-US", {month:'numeric', day: 'numeric'})
            };
            dreams.push(dream);
          });
          //console.log(dreams);
          res.render('profile-list', { title: "Dream Journal - List", theme: theme, greeting: greeting, dream: dreams});
        } else {
          console.log('Empty query:', query, 'vals:', err, data, count);
          res.render('profile-list', { title: "Dream Journal - List", theme: theme, greeting: greeting});
        }
      });
    }
  } else {
    res.redirect('/');
  }
});

router.get('/settings', (req, res) => {
    if(req.session.user){
      const selected = { val: req.session.data.theme, name: themeslist[req.session.data.theme] };
      const unselected = themes.filter(theme => theme.val !== selected.val);
      const theme = themeslist[req.session.data.theme];
      console.log(themes);
      res.render('settings', { title: "Dream Journal - Settings", selected: selected, themes: unselected, theme: theme});
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

router.get('/create', (req, res) => {
  if(req.session.user){
    const theme = themeslist[req.session.data.theme];
    res.render('profile-create', { title: "Dream Journal - Create", theme: theme, option: moods.map((v, n) => ({val: v, num: n}))});
  } else {
    res.redirect('/');
  }
});

router.post('/create', (req, res) => {
  if(req.session.user){
    // cleanup
    const name = req.body.dreamname;
    const quality = isNaN(req.body.dreamquality) ? 1 : parseInt(req.body.dreamquality);
    const mood = isNaN(req.body.dreamrating) ? 0 : parseInt(req.body.dreamrating);
    const content = req.body.content;
    const date = new Date(req.body.date);

    // query
    const query = {username: req.session.user};
    const user = mongoose.Types.ObjectId(req.session.data._id);

    const newDream = {
      user: user,
      name: name,
      date: !isNaN(date) ? date : new Date(),
      quality: quality,
      mood: mood,
      content: content,
      lastEdit: new Date()
    };

    const dreamObj = new Dream(newDream);

    //console.log(dreamObj);

    dreamObj.save(function(err, cat, count){
      if(err){
        console.log(err, cat, count);
        res.redirect('/');
      } else {
        User.findOneAndUpdate(query, { $push: {dreams: dreamObj._id} }, function(err, doc) {
          if(err){
              console.log(err, doc);
          } else {
            req.session.data.dreams.push(dreamObj._id);
            res.locals.user = req.session.data;
            console.log("saved new dream");
          }
          res.redirect('/');
        });
      }
    });
  } else {
    res.redirect('/');
  }
});


router.get('/dream/:slug', (req, res) => {
  const slug = req.params.slug;
  const query = {slug: slug};

  Dream.find(query, function(err, data, count) {
    if(data.length == 1){
      const raw = data[0];
      const dream = {
        name: raw.name,
        quality: raw.quality,
        face: moods[raw.mood],
        date: raw.date.toLocaleDateString("en-US", {month:'numeric', day: 'numeric'}),
        content: raw.content
      };
      console.log(dream);
      const theme = themeslist[req.session.data.theme];
      res.render('slug', { title: "Dream Journal - List", theme: theme, dream: dream });
    } else {
      console.log(err, data, count);
      res.redirect('profile');
    }
  });
});

module.exports = router;
