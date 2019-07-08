var mongoose = require('mongoose');

var FileSchema = new mongoose.Schema({
  name : String,
  data : String,
});

module.exports = mongoose.model('File', FileSchema);