const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Video} = require('./models');

Video.create("test");
Video.create("test2");
router.get('/videos', (req, res) => {
    Video
      .find()
      .then(videos => {
        res.json({
          videos: videos.map(
            (video) => video.serialize())
        });
      })
      .catch(err => {
        res.status(500).json({ message: 'Internal server error' });
      });
  });

  router.get('/videos/:id', (req, res) => {
    Video
      .findById(req.params.id)
      .then(video => res.json(video.serialize()))
      .catch(err => {
        res.status(500).json({ error: 'Something went wrong' });
      });
  });

  router.post('/videos', (req, res) => {
    const requiredFields = ['videoId'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        return res.status(400).send(message);
      }
    }
    Video
      .create({
        //title: req.body.title,
        videoId: req.body.videoId
      })
      .then(video => res.status(201).json(video.serialize()))
      .catch(err => {
        res.status(500).json({ error: 'Something went wrong' });
      });
  
  });

  router.delete('/videos/:id', (req, res) => {
    Video
      .findByIdAndRemove(req.params.id)
      .then(() => {
        res.status(204).end();
      });
  });
  
  module.exports =  router;