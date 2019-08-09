'use strict';
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {Video} = require('./models');

//get all videos
router.get('/api/videos', (req, res) => {
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

  //get videos by id
  router.get('/api/videos/:id', (req, res) => {
    Video
      .findById(req.params.id)
      .then(video => res.json(video.serialize()))
      .catch(err => {
        res.status(500).json({ error: 'Something went wrong' });
      });
  });

  //post new video
  router.post('/api/videos', jsonParser, (req, res) => {
    const requiredFields = ['videoId', 'title', 'description'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        return res.status(400).send(message);
      }
    }
    Video
      .create({
        videoId: req.body.videoId,
        title: req.body.title,
        description: req.body.description,
        likedUsers: req.body.likedUsers
      })
      .then(video => res.status(201).json(video.serialize()))
      .catch(err => {
        res.status(500).json({ error: 'Something went wrong' });
      });
  
  });

  //update video title and description
  router.put('/api/videos/:id', jsonParser, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      res.status(400).json({
        error: 'Request path id and request body id values must match'
      });
    }
  
    const updated = {};
    const updateableFields = ['title', 'description'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        updated[field] = req.body[field];
      }
    });
  //find video by id and update the fields
    Video
      .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
      .then(res.status(204).end())
      .catch(err => {
        res.status(500).json({ error: 'Something went wrong' });
      });
  });

  //delete video
  router.delete('/api/videos/:id', (req, res) => {
    Video
      .findByIdAndRemove(req.params.id)
      .then(res.status(204).end())
      .catch(err => {
        res.status(500).json({ error: 'Something went wrong' });
      });
  });
  
  module.exports =  router;