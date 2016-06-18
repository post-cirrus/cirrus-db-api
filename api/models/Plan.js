var uuid = require('node-uuid')
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PlansSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  speed: {
    type: String,
    required: true
  },
  uuid: {
    type: String,
    required: true,
    unique: true
  }
})

// Generates a uuid for the Community Cloud
PlansSchema.pre('save', function (next) {
  var plan = this
  if (this.isModified('uuid') || this.isNew) {
    plan.uuid = uuid.v4()
    next()
  } else {
    return next()
  }
})

module.exports = mongoose.model('SubscriptionPlan', PlansSchema)
