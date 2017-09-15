const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

let RouteSchema = new Schema({
  _creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  carId: Schema.Types.ObjectId,

  startStreet: String,
  endStreet: String,
  startTime: String,
  isReturning: Boolean,
  returnHour: String,
  viaStreets: [{
    name: String,
  }],
  days: {
    mon: Boolean,
    tue: Boolean,
    wed: Boolean,
    thu: Boolean,
    fri: Boolean,
    sat: Boolean,
    sun: Boolean,
  },

  passengers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]

})

const RouteModel = mongoose.model('Route', RouteSchema);

module.exports = RouteModel;
