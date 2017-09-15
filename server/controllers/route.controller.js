const User = require('../models/user.model'),
     Route = require('../models/route.model'),
  passport = require('passport'),
  mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = {

  findRoutes: function(req, res){
    let query = {};
    let days;
    let daysArray = [ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    console.log('server body', req.body);
    //prevent displaying own routes
    query._creator = { $ne: req.user._id };

    if(req.body.startStreet !== undefined){
      query.startStreet = { '$regex': '^' + req.body.startStreet + '$', $options: 'i'};
    }

    if(req.body.endStreet !== undefined){
      query.endStreet = { '$regex': '^' + req.body.endStreet + '$', $options: 'i'};
    }

    if(req.body.startTime !== undefined){
      query.startTime = req.body.startTime;
    }

    if(req.body.days !== undefined){
      days = req.body.days;

      daysArray.forEach( (dayName, i) => {
        if(days[i].day)
          query['days.'+dayName] = days[i].day;
      })
    }

    console.log(query);

    Route.find(query)
          .populate('_creator')
          .then(routes => {
            if(!routes){ res.send({success: false}); }
            else if(routes){ res.send({success: true, routes: routes}); }
          })
          .catch( err =>  res.send({success: false, err:err}))
  },


}
