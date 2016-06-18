var mongoose = require('mongoose')
var Schema = mongoose.Schema

var DeviceSchema = new Schema({
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
  },
  uuid: {
    type: String
  }
})

module.exports = mongoose.model('Device', DeviceSchema)
