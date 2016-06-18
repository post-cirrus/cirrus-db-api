var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
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
    type: Schema.Types.ObjectId,
    ref: 'Device'
  }],
  community: {
    type: Schema.Types.ObjectId,
    ref: 'Community'
  //  required: true
  }
})

// Hashes user's password and stores it
UserSchema.pre('save', function (next) {
  var user = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (error, salt) {
      if (error) {
        return next(error)
      }
      bcrypt.hash(user.password, salt, function (error, hash) {
        if (error) {
          return next(error)
        }
        user.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

module.exports = mongoose.model('User', UserSchema)
