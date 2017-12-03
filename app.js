'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var mongoose = require('mongoose');
var log = require('./api/helpers/logger');
module.exports = app; // for testing

var port = process.env.PORT || 10083;
var dbUrl = process.env.DB_URL || 'db.cirrus.io';
var dbPort = process.env.DB_PORT || 27017;
var apiServer = process.env.API_SERVER || 'clients.db.cirrus.io';
// Log Requests
app.use(require('morgan')('combined', { 'stream': log.stream }));

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) {
    throw err;
  }

  // install middleware
  swaggerExpress.register(app);

  mongoose.connect('mongodb://' + dbUrl + ':' + dbPort + '/Cirrus');
  mongoose.connection.on('error', log.error.bind(log, 'connection error: '));
  mongoose.connection.once('open', function () {
    app.listen(port, function () {
      log.info('Starting Cirrus DB service: http://' + apiServer + ':' + port);
    });
  });
});
