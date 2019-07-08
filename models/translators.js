var mongoose = require('mongoose');

var TranslatorSchema = new mongoose.Schema({
  name         : String,
  languages    : [String],
  pricePerWord : Number,
  comments     : String,
});

// Export the Mongoose model
module.exports = mongoose.model('Translator', TranslatorSchema);