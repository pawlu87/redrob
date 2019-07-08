var File = require('../models/files');

exports.postFile = function(req, res) {
  var file = new File();

  file.name = req.body.name;
  file.data = req.body.data;

  file.save(function(err) {
    if (err)
      res.send(err);

    console.log("Adding file: name: "+file.name + ", data: "+file.data);
    res.json({ message: 'File added', data: file });
  });
};

exports.getFiles = function(req, res) {
  File.find(function(err, files) {
    if (err)
      res.send(err);

    res.json(files);
  });
}

exports.getFile = function(req, res) {
  File.findById(req.params.file_id, function(err, file) {
    if (err)
      res.send(err);

    res.json(file);
  });
}

exports.putFile = function(req, res) {
  File.findById(req.params.file_id, function(err, file) {
    if (err)
      res.send(err);

    // Update the existing file quantity
    file.name = req.body.name;
    file.data = req.body.data;

    // Save the file and check for errors
    file.save(function(err) {
      if (err)
        res.send(err);

      res.json(file);
    });
  });
}

exports.deleteFile = function(req, res) {
  console.log("Removing File with id: "+req.params.File_id);
  File.findByIdAndRemove(req.params.File_id, function(err) {
    if (err)
      res.send(err);

    console.log("File removed");
    res.json({ message: 'File removed' });
  });
}