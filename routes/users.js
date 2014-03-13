'use strict';

var User = require('../models/User');

exports.collection = function(req, res){
  res.setHeader('Content-type', 'application/json');
  User.find({}, function(err, users){
    if(err){
      res.writeHead(500); //will print the internal server error
    } else {
      res.send(users);
    }
  });
};

exports.createUser = function(req, res) {
  res.setHeader('Content-type', 'application/json');

  var user = new User(req.body);
  user.save(function(err, responseUser){ //use responseUser to distinguish between the one sent and the one coming back
    if(err){
      res.writeHead(500);
      res.send({'error': err});
    } else {
      res.send(responseUser);
    }
  });
};

exports.findById = function(req, res) {
  res.setHeader('Content-type', 'application/json');
  var id = req.params.id;
  User.findOne({'_id': String(id)}, function(err, responseUser) {
    if(err) {
      res.send({'error': err});
    } else {
      res.send(responseUser);
    }
  });
};

exports.updateUser = function(req, res) {
  var id = req.params.id;
  var user = req.body;
  User.update({'_id': String(id)}, user, function(err){
    if(err) {
      res.send({'error': err});
    } else {
      res.send({msg: 'success'});
    }
  });
};

exports.deleteUser = function(req, res) {
  var id = String(req.params.id);
  User.remove({'_id': id}, function(err){
    if(err) {
      res.send({'error': err});
    } else {
      res.send({msg: 'success'});
    }
  });
};

