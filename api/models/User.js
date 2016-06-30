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

module.exports = mongoose.model('User', UserSchema)
