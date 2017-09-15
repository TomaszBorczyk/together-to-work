const User = require('../models/user.model'),
     Route = require('../models/route.model'),
     Request = require('../models/request.model'),
  passport = require('passport'),
  mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports ={

  add: function(req, res){
    let body = req.body;

    let newRequest = new Request({
      passenger: req.user._id,
      driver: body.driver_id,
      route: body.route_id,
      is_solved: false,
      is_accepted: false,
      is_shown: false,
    });

    newRequest.save(function(err){
      if(err){
        res.send({success: false, msg: 'Error occured while adding request'});
      }
      else{
        res.send({success: true});
      }
    })
  },

  getRequestsAsPassenger: function(req, res){
    let passenger_id= req.user._id;

    Request.find({passenger: passenger_id, is_solved: false})
           .populate('passenger driver route')
           .exec(function(err, requests){
              if(err){
                res.send({success: false, msg: 'Error occured while getting requests'});
              }
              else if(!requests){
                res.send({success: false, msg: 'No requests found'});
              }
              else{
                res.send({success: true, requests: requests});
              }
          })
  },

  areUnsolvedRequests: function(req, res){
    // let passenger_id = req.body.passenger_id;
    let passenger_id = req.user._id;
    let route_id = req.body.route_id;

    console.log('passenger_id', passenger_id, 'route_id', route_id);

    Request.areUnsolvedRequests(passenger_id, route_id,
      function(err, requests){
          if(err){ //error occured
            res.send({success: false, err: err});
          }
          else if(!requests){ //user never sent request for such route_id
            res.send({success: true, result: true});
            // return true;
          }
          else if(requests){ //user sent request, check if solved
            let unsolvedRequests = requests.filter(request => request.is_solved === false);
            let result = unsolvedRequests.length === 0 ? false : true;
            res.send({success: true, result: result});
            // return result;
          }

      }
    )
  },

  getRequestsAsDriver: function(req, res){
    let driver_id = req.user._id;

    Request.find({driver: driver_id, is_solved: false})
           .populate('passenger driver route')
           .exec(function(err, requests){
              if(err){
                res.send({success: false, msg: 'Error occured while getting requests'});
              }
              else if(!requests || requests === []){
                res.send({success: false, msg: 'No requests found'});
              }
              else{
                res.send({success: true, requests: requests});
              }
           })
  },

  solveRequest: function(req, res){
    let decision = req.body.decision,
        request_id = req.body.request_id;

    Request.findOneAndUpdate(
      {_id: request_id},
      { $set: { is_solved: true, is_accepted: decision}},
      function(err, request){
        if(err){
          res.send({success: false, msg: 'Error occured while resolving query'});
        } else if(!request){
          res.send({success: false, msg: 'Error: request not found'});
        } else{
          res.send({success: true, request: request});
        }

      }
    )
  },


  //TODO: maybe split it into 2 functions: one in request.controller and one in route.controller
  areFreeSeats: function(req, res){
    let request_id = req.body.request_id;

   Request.findOne({_id: request_id})
          .select('route')
          .then( request => request.route)
          .then( route_id =>
            Route.findOne({_id: route_id})
                 .select('_creator carId passengers')
                 .populate('_creator')
          )
          .then( route => {
            let passengerCount = route.passengers.length;
            let carSeats = route._creator.cars.filter( car => car._id.equals(route.carId))[0].seats;
            let freeSeats = carSeats - passengerCount;
            let areFreeSeats = freeSeats > 0 ? true : false;
            res.send({success: true, are_free: areFreeSeats});
          })
          .catch( err => res.send({success: false, err: err}));
  },

  acceptRequest: function(req, res){
    let request_id = req.body.request_id;
    let request;

    Request.findOneAndUpdate(
      {_id: request_id},
      { $set: { is_solved: true, is_accepted: true}} )
    .then( requestDB => {
      if(!requestDB) res.send({success: false, msg: 'Error: request not found'});
      else{
        request = requestDB;
        return requestDB;
      }
    })
    .then( request =>
      //add route to user's subscribed_routes
      User.findOneAndUpdate(
        {_id: request.passenger},
        {$push: {subscribed_routes: request.route}})
    )
    .then( user =>
      //add user to route's passengers
      Route.findOneAndUpdate(
        {_id: request.route},
        {$push: {passengers: user._id}})
     )
    .then( route => res.send({success: true}) )
    .catch( err => res.send({success: false, msg: 'Error occured while resolving query', err: err}) )

  },

  declineRequest: function(req, res){
    let request_id = req.body.request_id;

    Request.findOneAndUpdate(
      {_id: request_id},
      {$set: {is_solved: true}}
    )
    .then( request => res.send({success: true}))
    .catch( err => res.send({success: false, err: err}));
  },

  cancelRequest: function(req, res){
    let requestId = req.body.request_id;

    Request.deleteOne({_id: requestId})
           .then( () => res.send({success: true}))
           .catch( err => res.send({success: false, err: err}));
  },

  markAsShown: function(req, res){
    let requestId = req.body.request_id;
    Request.findOneAndUpdate(
      {_id: requestId},
      {$set: {is_shown: true}}
    )
    .then( request => res.send({success: true}))
    .catch( err => res.send({success: false, err: err}));
  },

  markAllAsShown: function(req, res){
    let userId = req.user._id;

    Request.update(
      {passenger: userId, is_shown: false},
      {$set: {is_shown: true}},
      {multi: true}
    )
    .then( count => res.send({success: true}))
    .catch( err => res.send({success: false, err: err}));
  },

  countResolvedtNotShown: function(req, res){
    let userId = req.user._id;
    Request.count({passenger: userId, is_solved: true, is_shown: false})
      .then( count => res.send({success: true, count: count}))
      .catch( err => res.send({success: false}));
  },

  countNewRequests: function(req, res){
    let userId = req.user._id;
    Request.count({driver: userId, is_solved: false})
      .then( count => res.send({success: true, count: count}))
      .catch( err => res.send({success: false}));
  },

}
