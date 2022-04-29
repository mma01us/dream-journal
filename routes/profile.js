// routes that apply to logged in users
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Dream = mongoose.model('Dream');
const greetingTime = require("greeting-time");
const calendarize = require('calendarize');

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
      const query = {user: req.session.data._id, $sort: { date : 1 } };
      Dream.find(query, function(err, data, count) {
        if(data.length > 0){
          const calendarName = data[0].date.toLocaleDateString("en-US", {month: 'long', year: 'numeric'});
          let dreams = data.map(d => {
              return {
                _id: d.slug,
                name: d.name,
                face: moods[d.mood],
                date: d.date.toLocaleDateString("en-US", {month:'numeric', day: 'numeric', year:'numeric'}
              )};
          }).filter(d => d.date.split('/')[-1] !== '');
          const thismonth = dreams[0].date.split('/')[0];
          dreams = dreams.filter(d => d.date.split('/')[0] === thismonth);
          let view = calendarize(dreams[0].date);
          view = view.map(week => {
            return { week: week.map(date => {
                if(date !== 0){
                  return {
                    day: date,
                    dream: dreams.filter(d => d.date.split('/')[1] === `${date}`)[0]
                  };
                } else {
                  return {};
                }
              })
            };
          });
          console.log(thismonth, view);
          res.render('profile-calendar', { title: "Dream Journal - List", theme: theme, greeting: greeting, calendarName: calendarName, view: view});
        } else {
          console.log('Empty query:', query, 'vals:', err, data, count);
          res.render('profile-calendar', { title: "Dream Journal - List", theme: theme, greeting: greeting});
        }
      });
    } else {
      const query = {user: req.session.data._id};
      Dream.find(query, function(err, data, count) {
        if(data.length > 0){
          const dreams = data.map(d => {
              return {
                _id: d.slug,
                name: d.name,
                face: moods[d.mood],
                date: d.date.toLocaleDateString("en-US", {month:'numeric', day: 'numeric'}
              )};
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
              console.log("Error updating user", err, docs);
          }
          else{
              console.log("Updated User: ", update, docs);
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
  if(req.session.user){
    const slug = req.params.slug;
    const query = {slug: slug};

    Dream.find(query, function(err, data, count) {
      if(data.length === 1){
        const raw = data[0];
        const dream = {
          name: raw.name,
          quality: raw.quality,
          face: moods[raw.mood],
          date: raw.date.toLocaleDateString("en-US", {month:'numeric', day: 'numeric'}),
          content: raw.content,
          slug: slug
        };
        console.log(dream);
        const theme = themeslist[req.session.data.theme] || 1;
        res.render('slug', { title: "Dream Journal - List", theme: theme, dream: dream });
      } else {
        console.log(err, data, count);
        res.redirect('profile');
      }
    });
  } else {
    res.redirect('/');
  }
});

router.post('/dream/delete', (req, res) => {
  if(req.session.user){
    const slug = req.body.slug;
      console.log(slug);
    const query = {slug: slug};

    Dream.findOneAndDelete(query, function(err, data, count) {
      if(!err){
        console.log(err, data, count);
        res.json({data: data});
      } else {
        console.log('Error deleting: ', err, data, count);
        res.json({error: err});
      }
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
