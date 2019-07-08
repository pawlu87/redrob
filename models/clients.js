var mongoose = require('mongoose');

var ClientSchema = new mongoose.Schema({
  name   : String,
  brands : [String],
  notes  : String,
});

// Export the Mongoose model
module.exports = mongoose.model('Client', ClientSchema);