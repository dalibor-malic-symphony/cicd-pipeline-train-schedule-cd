var request = require('supertest');
var express = require('express');
 
var app = require('../app');
 
describe('Index Page', function() {
  it("renders successfully", async function(done) {
    request(app).get('/').expect(200, done);
    await delay(1000);
  }).timeout(10000);
})

describe('Trains API', function() {
  it("returns data successfully", async function(done) {
    request(app).get('/trains').expect(200).expect('Content-Length', '1093').expect('Content-Type', /json/, done);
    await delay(1000);
  })
}).timeout(10000);
