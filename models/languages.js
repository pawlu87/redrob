var mongoose = require('mongoose');

var LanguageSchema = new mongoose.Schema({
  name : String,
  code : String,
});

// Export the Mongoose model
module.exports = mongoose.model('Language', LanguageSchema);