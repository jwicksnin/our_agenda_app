'use strict';
var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

app.configure(function(){
  app.use(express.bodyParser());  //parse requests going either way just the body
  app.use(express.static(path.join(__dirname, 'build')));
  app.use(app.router);  //always include the router last of the app.use stuff
});

app.configure('development', function(){
  app.use(express.errorHandler()); //in production, use an error log i.e. change this
});

var users = require('./routes/users');

app.get('/api/v1/users', users.collection); //app will now get the root directory

app.post('/api/v1/users', users.createUser);

app.get('/api/v1/users/:id', users.findById);

app.put('/api/v1/users/:id', users.updateUser);

app.delete('/api/v1/users/:id', users.deleteUser);


var server = http.createServer(app);
server.listen(3000, function() { //make sure it's running before it console.logs
  console.log('server running');
});

// or try app.listen(3000) aot creating the server var
