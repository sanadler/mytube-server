'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
//const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {Video} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedVideoData() {
  console.info('seeding video data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateVideoData());
  }
  // this will return a promise
  return Video.insertMany(seedData);
}

// used to generate data to put in db
function generateTitle() {
  const titles = [
    'Hey Jude', 'Here Comes the Sun', 'Help!', 'Yesterday', 'Penny Lane'];
  return titles[Math.floor(Math.random() * titles.length)];
}

function generateDescription() {
  const descriptions = ['This is by Paul McCartney', 'This is by George Harrison', 'This is by Ringo Starr', 'This is by John Lennon'];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateVideo() {
  const videos = [
    'Xs7xcpDMPRU', 'r9o1QS-itsU', 'u-XGpFRgrJ8', 'rTTEvlVdmvQ'];
  return videos[Math.floor(Math.random() * videos.length)];
}

function generateVideoData() {
  return {
    title: generateTitle(),
    description: generateDescription(),
    videoId: generateVideo()
  };
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Video API resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedVideoData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });
  
  describe('GET endpoint', function() {
    it("should return all existing videos", function() {
      let res;
      return chai.request(app)
        .get('/api/videos')
        .then(function(_res) {
          // so subsequent .then blocks can access response object
          res = _res;
          expect(res).to.have.status(200);
          // otherwise our db seeding didn't work
          expect(res.body.videos).to.have.lengthOf.at.least(1);
          return Video.count();
        })
        .then(function(count) {
          expect(res.body.videos).to.have.lengthOf(count);
        });
    });

    it('should return videos with right fields', function() {
      // Strategy: Get back all restaurants, and ensure they have expected keys

      let resVideo;
      return chai.request(app)
        .get('/api/videos')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.videos).to.be.a('array');
          expect(res.body.videos).to.have.lengthOf.at.least(1);

          res.body.videos.forEach(function(video) {
            expect(video).to.be.a('object');
            expect(video).to.include.keys(
              'title', 'description', 'videoId');
          });
          resVideo = res.body.videos[0];
          return Video.findById(resVideo.id);
        })
        .then(function(video) {

          expect(resVideo.title).to.equal(video.title);
          expect(resVideo.description).to.equal(video.description);
          expect(resVideo.videoId).to.equal(video.videoId);
        });
    });
  });
  describe('POST endpoint', function() {
    // strategy: make a POST request with data,
    // then prove that the restaurant we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new video', function() {

      const newVideo = generateVideoData();
      console.log(newVideo);

      return chai.request(app)
        .post('/api/videos')
        .send(newVideo)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'title', 'description', 'videoId');
          expect(res.body.title).to.equal(newVideo.title);
          // cause Mongo should have created id on insertion
          expect(res.body.id).to.not.be.null;
          expect(res.body.description).to.equal(newVideo.description);
          expect(res.body.videoId).to.equal(newVideo.videoId);
          return Video.findById(res.body.id);
        })
        .then(function(video) {
          expect(video.title).to.equal(newVideo.title);
          expect(video.description).to.equal(newVideo.description);
          expect(video.videoId).to.equal(newVideo.videoId);
        });
    });
  });
  

  describe('PUT endpoint', function() {

    it('should update fields you send over', function() {
      const updateData = {
        title: 'fofofofofofofof',
        description: 'xoxoxox'
      };
      

      return Video
        .findOne()
        .then(function(video) {
          updateData.id = video.id;

          // make request then inspect it to make sure it reflects
          // data we sent
          return chai.request(app)
            .put(`/api/videos/${video.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return Video.findById(updateData.id);
        })
        .then(function(video) {
          expect(video.title).to.equal(updateData.title);
          expect(video.description).to.equal(updateData.description);
        });
    });
  });

  describe('DELETE endpoint', function() {
    it('delete a video by id', function() {

      let video;

      return Video
        .findOne()
        .then(function(_video) {
          video = _video;
          return chai.request(app).delete(`/api/videos/${video.id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Video.findById(video.id);
        })
        .then(function(_video) {
          expect(_video).to.be.null;
        });
    });
  });
});