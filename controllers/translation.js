var Translation = require('../models/translations');

exports.postTranslation = function(req, res) {
  var translation = new Translation();

  translation.client        = req.body.client;
  translation.brand         = req.body.brand;
  translation.translator    = req.body.translator;
  translation.language_from = req.body.language_from;
  translation.language_to   = req.body.language_to;
  translation.words         = req.body.words;
  translation.pricePerWord  = req.body.pricePerWord;
  translation.date          = req.body.date;
  translation.comments      = req.body.comments;


  translation.save(function(err) {
    if (err)
      res.send(err);

    console.log("Adding translation for : " + translation.brand);
    res.json({ message: 'Translation added', data: translation });

    //update the contract words
    var contractController = require('./contract');
    contractController.patchContract(translation.client, undefined);
  });
};

exports.getTranslations = function(req, res) {
  Translation.find(function(err, translations) {
    if (err)
      res.send(err);

    res.json(translations);
  });
}

exports.getTranslation = function(req, res) {
  Translation.findById(req.params.translation_id, function(err, translation) {
    if (err)
      res.send(err);

    res.json(translation);
  });
}

exports.putTranslation = function(req, res) {

  Translation.findById(req.params.translation_id, function(err, translation) {
    if (err)
      res.send(err);

    console.log(req.body.client);

    // Update the existing translation
    translation.client        = req.body.client;
    translation.brand         = req.body.brand;
    translation.translator    = req.body.translator;
    translation.language_from = req.body.language_from;
    translation.language_to   = req.body.language_to;
    translation.words         = req.body.words;
    translation.pricePerWord  = req.body.pricePerWord;
    translation.date          = req.body.date;
    translation.comments      = req.body.comments;

    // Save the translation and check for errors
    translation.save(function(err) {
      if (err)
        res.send(err);

      res.json(translation);
    });
  });
}

exports.deleteTranslation = function(req, res) {
  console.log("Removing translation with id: "+req.params.translation_id);
  Translation.findByIdAndRemove(req.params.translation_id, function(err) {
    if (err)
      res.send(err);

    console.log("Translation removed");
    res.json({ message: 'Translation removed' });
  });
}

// -------------------------------------------------------------------
// contract - translations
// -------------------------------------------------------------------


exports.getTranslationsForContract = function(contract,contracts, res) {
  let fn = "getTranslationsForContract";

  contracts = resetContractWords(contracts);


  Translation.find({
      client   : contract.client,
      brand    : contract.brand
  },
  ['_id', 'language_from','language_to', 'words', 'date'],
  {
    sort:{
        date: 1 //Sort by Date Added DESC
    }
  },
  function(err,translations) {
    if (err && res !== undefined) {
      console.log("ERROR " + fn + ": " + err);
      res.send(err);
    }

    for (let i = 0; i < translations.length; i++) {
      let j = 0;

      //sort the translation languages
      let language_compare = translations[i].language_from.localeCompare(translations[i].language_to);
      if (language_compare == 1) {
        let temp = translations[i].from;
        translations[i].from = translations[i].to;
        translations[i].to   = temp;
      }

      while (j < contracts.length) {
        if (checkIfTranslationAppliesToContract(contracts[j], translations[i])) {
          break;
        }
        j++;
      }

      if (j == contracts.length ) {
        console.log("INFO " + fn + ": New contract needed for" + translations[i]);
        break;
      }

      if (contracts[j].words_remaining < translations[i].words) {
        translations[i].words = translations[i].words - contracts[j].words_remaining;
        contracts[j].words_remaining = 0;
        i--;
      } else {
        contracts[j].words_remaining = contracts[j].words_remaining - translations[i].words;
      }
    }

    var contractController = require('./contract');
    contractController.updateWordsRemaining(contracts);
    if (res !== undefined)
      res.send(contracts);
  });
}

function checkIfTranslationAppliesToContract(contract, translation) {
  
  //contract doesn't have the same langauge
  if (contract.language1 != translation.language_from) {
    return false
  }

  //contract doesn't have the same langauge
  if (contract.language2 != translation.language_to) {
    return false
  }

  //contract would have been expired for this translation
  if (contract.expiry.localeCompare(translation.date) == -1) {
    return false
  }

  //contract used up
  if (contract.words_remaining == 0) {
    return false;
  }
  return true;
}

function resetContractWords(contracts) {
  for (let i = 0; i < contracts.length; i++) {
    contracts[i].words_remaining = contracts[i].numberOfWords;
  }
  return contracts;
}
