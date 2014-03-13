'use strict';
//jshint unused:false

var superagent = require('superagent');
var chai = require('chai'),
  expect = chai.expect,
  should = chai.should();
var app = require('../app').app;

describe('Users JSON api', function(){ //ger the users collection
  var id;

  it('should be able to create a user', function(done) {
    superagent.post('http://localhost:3000/api/v1/users')
    .send({first_name: "Annie", last_name: "Wicksnin", email: "annie@jw.com"})
    .end(function(err, res){
      expect(err).to.be.equal(null);
      expect(res.body._id).to.not.be.equal(null);
      expect(res.body.first_name).to.be.equal("Annie"); //api sends the object back after it's been created so we can check it
      id = res.body._id; //mongo convention with this underscore aot just .id
      //console.log(id);
      done();
    });
  });

  it('get a collection', function(done){ //check to make sure no errors are coming back - first test
    superagent.get("http://localhost:3000/api/v1/users").end(function(er, res){
      expect(er).to.be.equal(null);
      expect(res.body.length).to.be.above(0);
      done(); //make sure the get has completed
    });
  });

  it('can get a single user', function(done){
    superagent.get('http://localhost:3000/api/v1/users/' + id).end(function(e, res){
      expect(e).to.be.equal(null);
      console.log(id);
      //expect(res.body._id).to.be.equal(id);
      expect(res.body.first_name).to.be.equal("Annie");
      expect(res.body.last_name).to.be.equal("Wicksnin");
      expect(res.body.email).to.be.equal("annie@jw.com");
      done();
    });
  });

  it('can update a user', function(done){
    superagent.put('http://localhost:3000/api/v1/users/' + id).send({first_name: 'Aruther', last_name: 'Dent'})
    .end(function(e,res){
      console.log(id);
      expect(e).to.eql(null);
      expect(res.body.msg).to.be.eql('success');
      done();
    });
  });

  it('can delete a user', function(done){
    superagent.del('http://localhost:3000/api/v1/users/' + id).end(function(e, res){
      expect(e).to.equal(null);
      expect(res.body.msg).to.be.equal('success');
      done();
    });
  });
});
