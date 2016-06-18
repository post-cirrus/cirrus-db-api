var uuid = require('node-uuid')
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CommunitySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  uuid: {
    type: String,
    unique: true
  },
  // One-to-One relation between Community and SubscriptionPlan
  subscription_plan: {
    type: Schema.Types.ObjectId,
    ref: 'SubscriptionPlans'
  },
  // One-to-Many relation between Community and Users
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'Users',
    unique: true
  }]
})

// Generates a uuid for the Community Cloud
CommunitySchema.pre('save', function (next) {
  var plan = this
  if (this.isModified('uuid') || this.isNew) {
    plan.uuid = uuid.v4()
    next()
  } else {
    return next()
  }
})

module.exports = mongoose.model('Community', CommunitySchema)
