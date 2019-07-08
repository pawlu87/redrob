var Translator = require('../models/translators');

exports.postTranslator = function(req, res) {
  var translator = new Translator();

  translator.name         = req.body.name;
  translator.languages    = req.body.languages;
  translator.pricePerWord = req.body.pricePerWord;
  translator.comments     = req.body.comments;


  translator.save(function(err) {
    if (err)
      res.send(err);

    console.log("Adding translator: name: " + translator.name + ", languages: "+translator.languages);
    res.json({ message: 'Translator added', data: translator });
  });
};

exports.getTranslators = function(req, res) {
  Translator.find(function(err, translators) {
    if (err)
      res.send(err);

    res.json(translators);
  });
}

exports.getTranslator = function(req, res) {
  Translator.findById(req.params.translator_id, function(err, translator) {
    if (err)
      res.send(err);

    res.json(translator);
  });
}

exports.putTranslator = function(req, res) {

  Translator.findById(req.params.translator_id, function(err, translator) {
    if (err)
      res.send(err);

    // Update the existing translator quantity
    translator.name         = req.body.name;
    translator.languages    = req.body.languages;
    translator.pricePerWord = parseInt(req.body.pricePerWord);
    translator.comments     = req.body.comments;



    // Save the translator and check for errors
    translator.save(function(err) {
      if (err)
        res.send(err);

      res.json(translator);
    });
  });
}

exports.deleteTranslator = function(req, res) {
  console.log("Removing translator with id: "+req.params.translator_id);
  Translator.findByIdAndRemove(req.params.translator_id, function(err) {
    if (err)
      res.send(err);

    console.log("Translator removed");
    res.json({ message: 'Translator removed' });
  });
}