const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  country: {
    type: String,
  },
  birthday: {
    type: String
  },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
  img: {
    type: String,
    default: 'placeholder.jpg',
  },
  slug: { type: String, slug: 'first_name', unique: true, slug_padding_size: 2 },
});

module.exports = mongoose.model('User', userSchema);