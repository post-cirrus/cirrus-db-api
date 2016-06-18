'use strict'

var log = require('../helpers/logger')
var User = require('../models/User')

module.exports = {
  list: function (request, response, next) {
    User.find(function (err, users) {
      if (err) {
        log.error('Error while calling GET /user ' + err)
        return next(err)
      }
      log.debug('Found ' + users.length)
      if (users.length <= 0) {
        response.status(200).json({success: false, message: 'Client.Cirrus.io DB is Empty.'})
      }
      response.status(200).json(users)
    })
  },
  create: function (request, response) {
    var user = new User(request.swagger.params.user.value)
    log.debug('Create request received from: \n' + '\tRemote ip : ' + request.ip + '\n' + '\tand body Form : "' + user + '"')
    User.create(user, function (error, user) {
      if (error) {
        log.error('Error while creating user \n\t"' + user + '" in DB.\n\t ERROR: ' + error)
        return response.status(400).json({success: false, errcode: error.code, message: error.errmsg}).end()
      }
      log.debug('User information: "' + user + '" => CREATED IN CLIENTS.DB.CIRRUS.IO')
      response.status(200).json({success: true, user: user}).end()
    })
  }
}
