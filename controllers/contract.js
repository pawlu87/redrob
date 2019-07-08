var Contract = require('../models/contracts');

exports.postContract = function(req, res) {
  var contract = new Contract();

  contract.client          = req.body.client;
  contract.brand           = req.body.brand;
  contract.price           = req.body.price;
  contract.numberOfWords   = req.body.numberOfWords;
  contract.expiry          = req.body.expiry;
  contract.comments        = req.body.comments;
  contract.words_remaining = req.body.numberOfWords;

  let language_compare = req.body.language1.localeCompare(req.body.language2)
  if (language_compare == -1) {
    contract.language1 = req.body.language1;
    contract.language2 = req.body.language2;
  } else if (language_compare == 1) {
    contract.language1 = req.body.language2;
    contract.language2 = req.body.language1;
  } else {
    console.log("languages are the same");
  }

  contract.save(function(err) {
    if (err)
      res.send(err);

    console.log("Adding contract for: client: "+contract.client);
    refreshWordsRemaining(contract, res);
  });
};

exports.getContracts = function(req, res) {
  Contract.find(function(err, contracts) {
    if (err)
      res.send(err);

    res.json(contracts);
  });
}

exports.getContract = function(req, res) {
  Contract.findById(req.params.contract_id, function(err, contract) {
    if (err)
      res.send(err);

    res.json(contract);
  });
}

exports.putContract = function(req, res) {
  Contract.findById(req.params.contract_id, function(err, contract) {
    if (err)
      res.send(err);

    contract.client        = req.body.client;
    contract.brand         = req.body.brand;
    contract.price         = req.body.price;
    contract.numberOfWords = parseInt(req.body.numberOfWords);
    contract.expiry        = req.body.expiry;
    contract.comments      = req.body.comments;

    let language_compare = req.body.language1.localeCompare(req.body.language2)
    if (language_compare == -1) {
      contract.language1 = req.body.language1;
      contract.language2 = req.body.language2;
    } else if (language_compare == 1) {
      contract.language1 = req.body.language2;
      contract.language2 = req.body.language1;
    } else {
      console.log("languages are the same");
    }

    // Save the contract and check for errors
    contract.save(function(err) {
      if (err)
        res.send(err);

      refreshWordsRemaining(contract, res);
    });
  });
}

exports.updateWordsRemaining = function(contracts) {
  let fn = "updateWordsRemaining";
  for (let i = 0; i < contracts.length; i++) {

    Contract.update({_id: contracts[i]._id}, {
      words_remaining: contracts[i].words_remaining
    }, function(err, affected, resp) {
       if (err)
        console.log("ERROR "+fn + ": "+err );
    })
  }
}


exports.patchContract = function(req, res) {
  Contract.findById(req.params.contract_id, function(err, contract) {
    if (err && res !== undefined)
      res.send(err);

    refreshWordsRemaining(contract, res)

  });
}


function refreshWordsRemaining(contract, res) {

  let translationController = require('./translation');

  // find contracts for this client
  Contract.find({
      client : contract.client,
      brand  : contract.brand
  },
  ['_id', 'client', 'brand', 'language1', 'language2', 'price', 'numberOfWords', 'expiry', 'comments'],
  {
    sort:{
        expiry: 1 //Sort by Date Added DESC
    }
  },
  function(err,contracts){
    if (err && res !== undefined)
      res.send(err);

    console.log(contracts);
    translationController.getTranslationsForContract(contract, contracts, res);
  });
}

exports.deleteContract = function(req, res) {
  console.log("Removing contract with id: "+req.params.contract_id);
  Contract.findByIdAndRemove(req.params.contract_id, function(err) {
    if (err)
      res.send(err);

    console.log("Contract removed");
    res.json({ message: 'Contract removed' });
  });
}