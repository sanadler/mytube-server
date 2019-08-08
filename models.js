'use strict';

const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
  videoId: {type: String, required: true},
  title: {type: String, required: true},
  description: {type: String, required: true},
  likedUsers: {type: String}
});


videoSchema.methods.serialize = function() {

  return {
    id: this._id,
    videoId: this.videoId,
    title: this.title,
    description: this.description,
    likedUsers: this.likedUsers
  };
};

const Video = mongoose.model('Video', videoSchema);

module.exports = {Video};