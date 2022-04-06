/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("__webpack_require__(/*! ./db */ \"./db.js\");\r\n\r\nconst express = __webpack_require__(/*! express */ \"express\");\r\nconst path = __webpack_require__(/*! path */ \"path\");\r\nconst config = __webpack_require__(/*! ./config */ \"./config.js\"); // convict config\r\n\r\nconst routes = __webpack_require__(/*! ./routes/index */ \"./routes/index.js\"); // applies to all routes\r\nconst profile = __webpack_require__(/*! ./routes/profile */ \"./routes/profile.js\"); // routes for logged in user\r\n\r\nconst app = express();\r\n\r\n// view engine setup\r\napp.set('views', path.join(__dirname, 'views'));\r\napp.set('view engine', 'hbs');\r\n\r\n// enable sessions\r\nconst session = __webpack_require__(/*! express-session */ \"express-session\");\r\n//const sessionOptions = {}; // TODO: FINISH THIS\r\n//app.use(session(sessionOptions));\r\n\r\napp.use(express.urlencoded({ extended: false }));\r\napp.use(express.static(path.join(__dirname, 'public')));\r\n\r\n// make user data available to all templates\r\n// app.use((req, res, next) => {\r\n//   res.locals.user = req.user;\r\n//   next();\r\n// });\r\n\r\napp.use('/', routes);\r\napp.use('/profile', profile);\r\n\r\n// use var here so async callback gets value\r\nvar server = app.listen(config.get('port'), config.get('ip'), () => {\r\n  const add = server.address();\r\n  console.log('running on http://' + add.address + ':' + add.port);\r\n});\r\n\n\n//# sourceURL=webpack://dream-journal/./app.js?");

/***/ }),

/***/ "./config.js":
/*!*******************!*\
  !*** ./config.js ***!
  \*******************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var convict = __webpack_require__(/*! convict */ \"convict\");\r\n\r\nconvict.addFormat((__webpack_require__(/*! convict-format-with-validator */ \"convict-format-with-validator\").ipaddress));\r\n\r\n// Define a schema\r\nvar config = convict({\r\n  env: {\r\n    doc: 'The application environment.',\r\n    format: ['production', 'development', 'test'],\r\n    default: 'development',\r\n    env: 'NODE_ENV'\r\n  },\r\n  ip: {\r\n    doc: 'The IP address to bind.',\r\n    format: 'ipaddress',\r\n    default: '127.0.0.1',\r\n    env: 'IP_ADDRESS',\r\n  },\r\n  port: {\r\n    doc: 'The port to bind.',\r\n    format: 'port',\r\n    default: 8080,\r\n    env: 'PORT',\r\n    arg: 'port'\r\n  },\r\n  db: {\r\n    host: {\r\n      doc: 'Database host name/IP',\r\n      format: '*',\r\n      default: 'localhost'\r\n    },\r\n    name: {\r\n      doc: 'Database name',\r\n      format: String,\r\n      default: 'dreamdb'\r\n    }\r\n  }\r\n});\r\n//\r\n// // Load environment dependent configuration\r\n// var env = config.get('env');\r\n// config.loadFile('./config/' + env + '.json');\r\n//\r\n// // Perform validation\r\n// config.validate({allowed: 'strict'});\r\n\r\nmodule.exports = config;\r\n\n\n//# sourceURL=webpack://dream-journal/./config.js?");

/***/ }),

/***/ "./db.js":
/*!***************!*\
  !*** ./db.js ***!
  \***************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\"),\r\n\tURLSlugs = __webpack_require__(/*! mongoose-url-slugs */ \"mongoose-url-slugs\")\r\n\r\nconst config = __webpack_require__(/*! ./config */ \"./config.js\")\r\n// unpack into vars\r\nconst host = config.get('db.host');\r\nconst name = config.get('db.name');\r\n\r\nconst User = new mongoose.Schema({\r\n\tusername: { type: String, required: true, index: { unique: true } },\r\n  pass: { type: String, required: true },\r\n\ttheme: { type: Number, required: true},\r\n\tcalendar: { type: Boolean, required: true},\r\n  dreams:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dream' }]\r\n});\r\n\r\nconst Section = new mongoose.Schema({\r\n\titem: {type: String, required: true},\r\n\tdata: {type: String}\r\n}, {\r\n\t_id: true\r\n});\r\n\r\n\r\nconst Dream = new mongoose.Schema({\r\n  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},\r\n  name: {type: String, required: true},\r\n\tdate: {type: Date, required: true},\r\n\tquality: {type: Number, required: true},\r\n\tmood: {type: Number, required: true},\r\n\tsections: [Section],\r\n\tlastEdit: {type: Date, required: true}\r\n});\r\n\r\nDream.plugin(URLSlugs('name'));\r\n\r\nmongoose.model('User', User);\r\nmongoose.model('Dream', Dream);\r\nmongoose.model('Section', Section);\r\nmongoose.connect(`mongodb://${host}/${name}`);\r\n\n\n//# sourceURL=webpack://dream-journal/./db.js?");

/***/ }),

/***/ "./routes/index.js":
/*!*************************!*\
  !*** ./routes/index.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("// routes that apply to entire webpage\r\nconst express = __webpack_require__(/*! express */ \"express\");\r\nconst router = express.Router();\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nconst User = mongoose.model('User');\r\n\r\nrouter.get('/', (req, res) => {\r\n  // if logged in, redirect to /profile, else:\r\n  res.render('index', {title: \"Dream Journal - Home\"});\r\n});\r\n\r\nrouter.get('/register', (req, res) => {\r\n  // if logged in, redirect to /profile, else:\r\n  res.render('register', {title: \"Dream Journal - Register\"});\r\n});\r\n\r\nrouter.get('/login', (req, res) => {\r\n  // if logged in, redirect to /profile, else:\r\n  res.render('login', {title: \"Dream Journal - Login\"});\r\n});\r\n\r\nrouter.post('/register', (req, res) => {\r\n  // parse user. if invalid, render register with err msg, else log user in, then redirect to profile\r\n  res.redirect('/');\r\n});\r\n\r\nrouter.post('/login', (req, res) => {\r\n  // if user is valid login, else, render login again with err msg\r\n  res.redirect('/');\r\n});\r\n\r\nrouter.get('/logout', (req, res) => {\r\n  // logout and send to index\r\n  res.redirect('/');\r\n});\r\n\r\nmodule.exports = router;\r\n\n\n//# sourceURL=webpack://dream-journal/./routes/index.js?");

/***/ }),

/***/ "./routes/profile.js":
/*!***************************!*\
  !*** ./routes/profile.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("// routes that apply to logged in users\r\nconst express = __webpack_require__(/*! express */ \"express\");\r\nconst router = express.Router();\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nconst User = mongoose.model('User');\r\nconst Section = mongoose.model('Section');\r\nconst Dream = mongoose.model('Dream');\r\n\r\nrouter.get('/profile', (req, res) => {\r\n  // if not logged in, redirect to index.js\r\n  res.redirect('/');\r\n  // else, parse the user and display their data\r\n});\r\n\r\nmodule.exports = router;\r\n\n\n//# sourceURL=webpack://dream-journal/./routes/profile.js?");

/***/ }),

/***/ "convict":
/*!**************************!*\
  !*** external "convict" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("convict");

/***/ }),

/***/ "convict-format-with-validator":
/*!************************************************!*\
  !*** external "convict-format-with-validator" ***!
  \************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("convict-format-with-validator");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("express-session");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),

/***/ "mongoose-url-slugs":
/*!*************************************!*\
  !*** external "mongoose-url-slugs" ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongoose-url-slugs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./app.js");
/******/ 	
/******/ })()
;