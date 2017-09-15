const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

let StreetSchema = new Schema({
  name: String,
})

const StreetModel = mongoose.model('Street', StreetSchema);

module.exports = StreetModel;
