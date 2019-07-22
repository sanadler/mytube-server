'use strict';

const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
 // title: {type: String, required: true},
  videoId: {type: String, required: true},
});


videoSchema.methods.serialize = function() {

  return {
    id: this._id,
   // title: this.title,
    videoId: this.videoId
  };
};

const Video = mongoose.model('Video', videoSchema);

module.exports = {Video};