'use strict';
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();

const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);


//const videosRouter = require('./videosRouter');
//app.use(require('./jwtRouter'));
app.use(require('./videosRouter'));
//app.use('/', jwtRouter);
//app.use('/videos', videosRouter);

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');

// log the http layer
app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});



  app.use('*', function (req, res) {
    res.status(404).json({ message: 'Not Found' });
  });
  

  let server;
  
  function runServer(databaseUrl, port = PORT) {
  
    return new Promise((resolve, reject) => {
      mongoose.connect(databaseUrl, err => {
        if (err) {
          return reject(err);
        }
        server = app.listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      }, { useNewUrlParser: true });
    });
  }

  function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  }

  if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
  }

  module.exports = { app, runServer, closeServer };