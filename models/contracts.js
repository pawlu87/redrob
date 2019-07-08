var mongoose = require('mongoose');

var ContractSchema = new mongoose.Schema({
  client          : String,
  brand           : String,
  language1       : String,
  language2       : String,
  price           : Number,
  numberOfWords   : Number,
  words_remaining : Number,
  expiry          : String,
  comments        : String,
});

// Export the Mongoose model
module.exports = mongoose.model('Contract', ContractSchema);