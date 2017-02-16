// Todo: Create Artist Model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlbumSchema = require('./album');

const ArtistSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: name => name.length > 2,
      message: 'Name must be longer than 2 characters',
    },
    required: true,
  },
  age: Number,
  yearsActive: Number,
  image: String,
  genre: String,
  website: String,
  netWorth: Number,
  labelName: String,
  retired: Boolean,
  albums: [AlbumSchema],
});

const Artist = mongoose.model('artist', ArtistSchema);

module.exports = Artist;
