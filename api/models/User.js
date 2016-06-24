var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var log = require('../helpers/logger')
var _ = require('lodash')
var Schema = mongoose.Schema

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Kid', 'Admin', 'Family'],
    default: 'Family',
    required: true
  },
  oauth: [{
    provider: {
      type: String
    },
    access_token: {
      type: String
    }
  }],
  devices: [{
    type: {
      type: String,
      required: true
    },
    mac: {
      type: String,
      required: true
    },
    name: {
      type: String
    }
  }],
  community: {
    type: Schema.Types.ObjectId,
    ref: 'Community'
  //  required: true
  }
})

// Hashes user's password and stores it
/*UserSchema.pre('save', function (next) {
  var user = this
  log.debug('Crypting password of user ' + this._id)
//  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (error, salt) {
      if (error) {
        return next(error)
      }
      bcrypt.hash(user.password, salt, function (error, hash) {
        if (error) {
          return next(error)
        }
        log.debug('Password crypted password of user ' + this._id)
        user.password = hash
        next()
      })
    })
//  } else {
//    return next()
//  }
})

UserSchema.pre('findOneAndUpdate', function (next) {
  var query = this.getQuery()  // contains id
  var update = this.getUpdate()
  log.debug('Query: ' + JSON.stringify(query, null, 2))
  log.debug('Update data ' + JSON.stringify(update, null, 2))
  log.debug('password: ' + update.password)
  this.findOne({_id: query._id}, function (error, user) {
    if (error) {
      return next(error)
    }
  //  if (_.has(update, 'password')) {
    user.password = update.password
    user.save()
    next()
  })
})*/

module.exports = mongoose.model('User', UserSchema)
