# Dream Journal

Note: This is a final project from Applied Internet Technology.

## Overview

Have you ever had a dream that was really interesting but forgot about it an hour later? Dream Journal is a web application that let's you track your dreams. Users must login to store their dreams so they remain between sessions. Dreams are linked with a date and include a scale for users to rate how they felt afterwards. Users can name the dream. Additionally, users can view a calendar view of all of their dreams and how they felt about them. Included will be a settings menu for users to choose if they want a list or calendar view as their main page, and a theme customization.


## Data Model

The application will store Users, Dreams, and Sections

* users can have multiple dreams (via references - this is to set up the structure for sharing)

An Example User:

```javascript
{
  username: // selected username,
  pass: // a password hash,
  theme: // integer representing user preferred theme
  calendar: // boolean T/F for user preferred view
  dreams: // an array of references to List documents
}
```

An Example Dream:

```javascript
{
  user: // a reference to a User object
  name: // name of dream
  date: // recorded date of dream
  quality: // user recorded quality of dream
  mood: // user mood - stored as integer - how they felt in the morning
  content: // content of the dream
  lastEdit: // timestamp for last edit
}
```

## [Link to Schema](db.js)

## Wireframes

/profile - page for showing all personal dreams - list and calendar view

![list](documentation/profile-list.png)
![list](documentation/profile-calendar.png)

/profile/create - page for creating a new dream

![list create](documentation/profile-create.png)

/profile/dream/slug - page for viewing and deleting a specific dream

![list](documentation/profile-dream.png)

/profile/settings - page for modifying user settings

![list create](documentation/settings.png)

## Site map

![Alt text](documentation/site-map1.png "Sitemap")
*Target Sitemap*

## User Stories or Use Cases

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can view all of my dream entries
4. as a user, I can create a new dream entry
6. as a user, I can view my settings
7. as a user, I can change my visual settings in the settings
8. as a user, I can view a specific dream entry
9. as a user, I can delete a specific dream entry

## Research Topics

* Configuration management - Node convict to manage deploys on local machine and free website hosting service such as Herokuapp.
* Webpack to automate:
  * Sass as a CSS preprocessor to help with managing themes.
* External Library: [Calendarize](https://www.npmjs.com/package/calendarize) for generating the calendar view. It's relatively lightweight and I will need to make changes on top of it so I am assigning it half a point.
* External Library [greeting-time](https://www.npmjs.com/package/greeting-time) for getting a greeting message depending on time of day. Similar to calendarize, it's very lightweight and more for utility so I am assigning it half a point.


## [Link to Initial Main Project File](app.js)

## Annotations / References Used

1. [Setting up Sass and Webpack](https://florianbrinkmann.com/en/sass-webpack-4240/)
2. [For setting up Webpack with Express](https://binyamin.medium.com/creating-a-node-express-webpack-app-with-dev-and-prod-builds-a4962ce51334)
3. No explicit links: Documentation pages for Sass, Webpack, Crypto
4. [Theming with Sass](https://www.toptal.com/sass/theming-scss-tutorial)

## Usage and Scripts:

1. npm run test: run and track changes
2. npm run build: build scss into css
3. npm run watch: automatically track and build scss into css
4. npm run start: run the app
5. npm run verify: run eslint on the files
