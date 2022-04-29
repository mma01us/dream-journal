const mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs');

const config = require('./config');
// unpack into vars
const host = config.get('env') === 'production' ? process.env.db_host : config.get('db.host');
const name = config.get('env') === 'production' ? process.env.db_name : config.get('db.name');
const prefix = config.get('db.prefix');

const User = new mongoose.Schema({
	username: { type: String, required: true, index: { unique: true } },
  pass: { type: String, required: true },
	theme: { type: Number, required: true},
	calendar: { type: Boolean, required: true},
  dreams:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dream' }]
});

const Dream = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: {type: String, required: true},
	date: {type: Date, required: true},
	quality: {type: Number, required: true},
	mood: {type: Number, required: true},
	content: {type: String},
	lastEdit: {type: Date, required: true}
});

Dream.plugin(URLSlugs('name'));

mongoose.model('User', User);
mongoose.model('Dream', Dream);
// unfortunately this is hardcoded for now
mongoose.connect(`${prefix}://${host}/${name}`);
//mongoose.connect(`mongodb+srv://michael:HhcoE6KDAQ5cr6YL@dreamjournalcluster.f9nai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);
