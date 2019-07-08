var mongoose = require('mongoose');

var TranslationSchema = new mongoose.Schema({
  client        : String,
  brand         : String,
  translator    : String,
  language_from : String,
  language_to   : String,
  words         : Number,
  pricePerWord  : Number,
  file          : [String],
  date          : String,
  comments      : String,
});

// Export the Mongoose model
module.exports = mongoose.model('Translation', TranslationSchema);