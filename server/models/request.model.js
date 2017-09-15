const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

let RequestSchema = new Schema({
  passenger: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  route: {
    type: Schema.Types.ObjectId,
    ref: 'Route'
  },
  is_solved: Boolean,
  is_accepted: Boolean,
  is_shown: Boolean,
})

RequestSchema.statics.areUnsolvedRequests = function(passenger_id, route_id, cb) {
  return this.find({passenger: passenger_id, route: route_id}, cb)
};


const RequestModel = mongoose.model('Request', RequestSchema);

module.exports = RequestModel;
