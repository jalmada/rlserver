"user strict";
var express = require('express');
var cors = require('cors');

var activityRouter = require('./routes/activity');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var allowedOrigins = ["http://localhost:9000", "http://localhost:3001", "http://localhost:3000"];

app.use(cors({
    origin: function(origin, callback){

      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  }));

app.use('/activity', activityRouter);

module.exports = app;
