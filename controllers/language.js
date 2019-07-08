var Language   = require('../models/languages');
var Translator = require('../models/translators');

exports.postLanguage = function(req, res) {
  var language = new Language();

  language.name = req.body.name;
  language.code = req.body.code;

  language.save(function(err) {
    if (err)
      res.send(err);

    console.log("Adding language: name: "+language.name + ", code: "+language.code);
    res.json({ message: 'Language added', data: language });
  });
};

exports.getLanguages = function(req, res) {
  Language.find(function(err, languages) {
    if (err)
      res.send(err);

    res.json(languages);
  });
}

exports.getLanguage = function(req, res) {
  Language.findById(req.params.language_id, function(err, language) {
    if (err)
      res.send(err);

    res.json(language);
  });
}

exports.putLanguage = function(req, res) {
  Language.findById(req.params.language_id, function(err, language) {
    if (err)
      res.send(err);

    // Update the existing language quantity
    language.name = req.body.name;
    language.code = req.body.code;

    // Save the language and check for errors
    language.save(function(err) {
      if (err)
        res.send(err);

      res.json(language);
    });
  });
}

exports.deleteLanguage = function(req, res) {


  Translator.findOne({ 'languages': req.params.language_id }, function (err, tramslator) {
    if (err)
      res.send(err);

    if (!tramslator) {
        Language.findByIdAndRemove(req.params.language_id, function(err) {
          if (err)
            res.send(err);
        });

        res.json({ message: 'Language removed' });
        return
    }

    console.log("found tramslator " + tramslator.languages);

    console.log("Language removed");
    res.status(400).json({ dependency: 'translator' });



  });
}