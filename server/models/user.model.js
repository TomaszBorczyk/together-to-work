const passportLocalMongoose = require('passport-local-mongoose'),
                   mongoose = require('mongoose'),
                     Schema = mongoose.Schema;

let UserSchema = new Schema({
  username:  String,
  email: String,
  cars: [
    {
      id: Schema.Types.ObjectId,
      color: String,
      description: String,
      name: String,
      seats: Number,
    }
  ],
  routes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Route'
    }
  ],
  ratings:[{
    value: Number,
    comment: String,
    // author:{
    //   type: Schema.Types.ObjectId,
    //   ref: this,
    // },
    author: { type: String, ref: 'User'}
  }],

  subscribed_routes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Route'
    }
  ],

  facebook: {
    id: String,
  },
  google: {
    id: String,
  },
  date_created: { type: Date, default: Date.now },
});

UserSchema.plugin(passportLocalMongoose);

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
