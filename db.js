const mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs')

const config = require('./config')
// unpack into vars
const host = config.get('db.host');
const name = config.get('db.name');

const User = new mongoose.Schema({
	username: { type: String, required: true, index: { unique: true } },
  pass: { type: String, required: true },
	theme: { type: Number, required: true},
	calendar: { type: Boolean, required: true},
  dreams:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dream' }]
});

const Section = new mongoose.Schema({
	item: {type: String, required: true},
	data: {type: String}
}, {
	_id: true
});


const Dream = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: {type: String, required: true},
	date: {type: Date, required: true},
	quality: {type: Number, required: true},
	mood: {type: Number, required: true},
	sections: [Section],
	lastEdit: {type: Date, required: true}
});

Dream.plugin(URLSlugs('name'));

mongoose.model('User', User);
mongoose.model('Dream', Dream);
mongoose.model('Section', Section);
// unfortunately this is hardcoded for now
//mongoose.connect(`mongodb://${host}/${name}`);
mongoose.connect(`mongodb+srv://michael:HhcoE6KDAQ5cr6YL@dreamjournalcluster.f9nai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);
