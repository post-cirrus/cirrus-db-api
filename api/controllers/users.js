'use strict'

var log = require('../helpers/logger')
var User = require('../models/User')
var _ = require('lodash')

module.exports = {
  /*
  * List all the users that are stored in the database
  */
  listUsers: function (request, response, next) {
    User.find(function (error, users) {
      if (error) {
        log.error('List Users ERROR: ' + error)
        return response.status(400).json({message: error.code + ' : ' + error.errmsg}).end()
      }
      if (users.length <= 0) {
        log.debug('Cirrus Users Collections is empty, found ' + users.length + ' in Cirrus Users Collection: => \n' + JSON.stringify(users, null, 2) + '\n\n')
        log.info('No entry found "' + users.length + '" in Cirrus Users Collection')
        return response.status(404).json({message: 'Is Empty.'}).end()
      }
      log.debug('Found ' + users.length + ' entries in Cirrus Users Collection: => \n' + JSON.stringify(users, null, 2) + '\n\n')
      log.info('Found ' + users.length + ' entries in Cirrus Users Collection')
      return response.status(200).json(users).end()
    })
  },
  /*
  * Creates a user in the database
  */
  createUser: function (request, response, next) {
    var user = new User(request.swagger.params.user.value)
    log.debug('Create request received from: \n' + '\tRemote ip : ' + request.ip + '\n' + '\tand body Form : "' + user + '"')
    User.create(user, function (error, user) {
      if (error) {
        if (error) {
          log.error('Creating User ERROR: ' + error)
          return response.status(400).json({message: error.code + ' : ' + error.errmsg}).end()
        }
      }
      log.debug('User information: "' + user + '" => CREATED IN CLIENTS.DB.CIRRUS.IO')
      return response.status(200).json(user).end()
    })
  },
  /*
  * Finds the user using the mongo DB ObjectId
  */
  findUserById: function (request, response, next) {
    var id = request.swagger.params.id.value
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      User.findById(id, function (error, user) {
        if (error) {
          log.error('Find user by Id ERROR: ' + error)
          return response.status(400).json({message: error.code + ' : ' + error.errmsg}).end()
        }
        if (user !== null) {
          log.info('Found user entry \n' + JSON.stringify(user, null, 2) + ' \n => in Collection')
          return response.status(200).json(user).end()
        }
      //  log.debug('No user found using Cirrus users Collections => \n' + JSON.stringify(user, null, 2) + '\n\n')
        log.info('Nothing found in Cirrus Users Collection using ID: ' + id)
        return response.status(404).json({message: 'User not found id: ' + id}).end()
      })
    } else {
      log.error('Invalid mongo ObjectId provided => ID: "' + id + '"')
      return response.status(406).json({message: 'Not Acceptable. Id:' + id}).end()
    }
  },
  /*
  * Finds the user using the user's username
  */
  findUserByUsername: function (request, response, next) {
    var username = request.swagger.params.username.value
    User.findOne({username: username}, function (error, user) {
      if (error) {
        log.error('Find user by username ERROR: ' + error)
        return response.status(400).json({message: error.code + ' : ' + error.errmsg}).end()
      }
      log.info('Querying Cirrus Users collection for username: ' + username + ' returned User: \n\t' + user)
      if (_.isNull(user)) {
        log.info('No user found with username: ' + username)
        response.status(404).send({message: 'Not Found. Username: ' + username}).end()
      } else {
        response.status(200).json(user).end()
      }
    })
  },
  /*
  * Deletes the user object in the mongoDB
  */
  removeUserById: function (request, response, next) {
    var id = request.swagger.params.id.value
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      User.findByIdAndRemove(id, function (error, user) {
        if (error) {
          log.error('Remove user by Id: ' + error)
          return response.status(500).json({message: 'Internal Server Error'}).end()
        }
        if (user !== null) {
          log.info('User with ID: "' + id + '" => DELETED from Users Collection')
          return response.status(200).end()
        } else {
          log.info('No user found with id :' + id)
          return response.status(404).json({message: 'Not Found Id: ' + id}).end()
        }
      })
    } else {
      log.error('Invalid mongo ObjectId provided => ID: "' + id + '"')
      return response.status(406).json({message: 'Not Acceptable. Id:' + id}).end()
    }
  },
  /*
  * Updates the user's details in the monogodb
  */
  updateUserById: function (request, response, next) {
    var id = request.swagger.params.id.value
    var user = request.swagger.params.user.value
    log.debug('Update user with Id: ' + id + ' with values => \n\t' + JSON.stringify(user, null, 2))

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      if (_.has(user, 'devices')) {
        log.debug('Update request contains devices information that needs to be removed otherweise it will overrite the existing information.')
        log.debug('User object to update, BEFORE removing Devices: \n\t =>' + JSON.stringify(user, null, 2))
        user = _.omit(user, 'devices')
        log.debug('User object to update, AFTER removing Devices array: \n\t =>' + JSON.stringify(user, null, 2))
      }
      if (_.has(user, 'oauth')) {
        log.debug('Update request contains oauth provider information that needs to be removed otherweise it will overrite the existing information.')
        log.debug('User object to update, BEFORE removing Oauth information: \n\t =>' + JSON.stringify(user, null, 2))
        user = _.omit(user, 'oauth')
        log.debug('User object to update, AFTER removing Oauth array: \n\t =>' + JSON.stringify(user, null, 2))
      }
      User.findOneAndUpdate({_id: id}, user, {safe: true, new: true}, function (error, user) {
        if (error) {
          log.error('Update user by Id: ' + error)
          return response.status(500).json({message: 'Internal Server Error'}).end()
        }
        log.info('Update susccessfull => Update user wiht id ' + id + '. New user : => \n\t' + user)
        return response.status(200).json(user)
      })
    } else {
      log.error('Invalid mongo ObjectId provided => ID: "' + id + '"')
      return response.status(406).json({message: 'Not Acceptable. Id:' + id}).end()
    }
  }
}
