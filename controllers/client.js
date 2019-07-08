var Client = require('../models/clients');

exports.postClient = function(req, res) {
  var client = new Client();

  client.name   = req.body.name;
  client.brands = req.body.brands;
  client.notes  = req.body.notes;

  client.save(function(err) {
    if (err)
      res.send(err);

    console.log("Adding client: name: "+client.name + ", notes: "+client.notes);
    res.json({ message: 'Client added', data: client });
  });
};

exports.getClients = function(req, res) {
  Client.find(function(err, clients) {
    if (err)
      res.send(err);

    res.json(clients);
  });
}

exports.getClient = function(req, res) {
  Client.findById(req.params.client_id, function(err, client) {
    if (err)
      res.send(err);

    res.json(client);
  });
}

exports.putClient = function(req, res) {
  Client.findById(req.params.client_id, function(err, client) {
    if (err)
      res.send(err);

    // Update the existing client quantity
    client.name   = req.body.name;
    client.brands = req.body.brands;
    client.notes  = req.body.notes;

    // Save the client and check for errors
    client.save(function(err) {
      if (err)
        res.send(err);

      res.json(client);
    });
  });
}

exports.deleteClient = function(req, res) {
  console.log("Removing client with id: "+req.params.client_id);
  Client.findByIdAndRemove(req.params.client_id, function(err) {
    if (err)
      res.send(err);

    console.log("Client removed");
    res.json({ message: 'Client removed' });
  });
}