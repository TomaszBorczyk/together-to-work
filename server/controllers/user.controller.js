const User = require('../models/user.model'),
     Route = require('../models/route.model'),
  passport = require('passport'),
  mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = {

  //=======================
  // AUTHENTICATION & USER
  //=======================

  postRegister: function(req, res, next){
    User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function(err, user){
      if(user){ passport.authenticate('local')(req, res, function(){ res.send({success: true})}) }
      if(err) next(err);
    })
        // .then( user =>  passport.authenticate('local')(req, res, function(){ res.send({success: true})}) )
        // .catch( err => next(err))
  },

  login: function(req, res){
    console.log('auth:', req.isAuthenticated());
    console.log('LOGIN',req.user);
    res.send(
      {
        id: req.user._id,
        username: req.user.username,
        cars: req.user.cars,
      }
    );
  },



  changePassword: function(req, res){
    let newPass = req.body.new_password;

    User.findOne( {_id: req.user._id})
        .then( user => {
            if(!user){
              console.log('user not found');
              res.send({success: false, msg: 'User not found'});
            }
            else{ return user.setPassword(newPass) }
        })
        .then( () => user.save() )
        .then( () => res.send({success: true}) )
        .catch( err => res.send({success: false, err: err}) )},

  getUser: function(req, res){
    let UserID = req.query.userid;
    User.findOne({_id: UserID})
    .populate("ratings.author") //uprościć
    .exec(function(err, user){
      if(err){
         console.log(err);
         res.send({success: false});
         return;}
      if(!user){
        console.log("Can't find this user.");
        res.send({success: false});}
      if(user){
        res.send(user);};
    })
  },


  //=======================
  //        ROUTES
  //=======================


  addRoute: function(req, res){
    console.log(req.body.route);
    let newRoute = new Route({
      _creator: req.user._id,
      startStreet: req.body.route.startStreet,
      endStreet: req.body.route.endStreet,
      startTime: req.body.route.startTime,
      isReturning: req.body.route.isReturning,
      carId: req.body.route.carId,
      viaStreets: req.body.route.viaStreets,
      days: req.body.route.days,
    });

    let user;

    User.findOne({_id: req.user._id})
        .then( userDB => {
          if(!userDB){
            res.send({success: false, msg: 'User not found'});
            throw 'User not found';
          }
          else{
            user = userDB; return newRoute.save();
          }
        })
        .then( () => {
          user.routes.push(newRoute);
          return user.save()
        })
        .then( () =>{ console.log('positive feedback'); res.send({success: true, route: { id: newRoute._id}}); })
        .catch( err => { console.log('err', err); res.send({success: false, msg: 'Error occured while saving user', err: err}); } )

  },


  removeRoute: function(req, res){
    let id = req.body.route.id;

    Route.remove({_id: id})
         .then( () => User.findOneAndUpdate(
                         {_id: req.user._id},
                         {$pull: {routes: id}},
                         {new: true})
         )
         .then( user => res.send({success: true}))
         .catch( err => res.send({success: false, err: err}) )

  },

  getUserRoutes: function(req, res){
    User.findOne( {_id: req.user._id} )
        .populate({
           path: 'routes',
           populate: {
             path: 'passengers',
             model: 'User',
             select: '_id username'
           }
        })
        .then( user => res.send({success: true, routes: user.routes}) )
        .catch( err => res.send({success: false, msg: 'Error occured while processing query', err: err}) )
  },


  //=======================
  //        CARS
  //=======================

  addCar: function(req, res){
    let newCar = {
      color: req.body.car.color,
      description: req.body.car.description,
      name: req.body.car.name,
      seats: req.body.car.seats
    };

    User.findOneAndUpdate(
          {_id: req.user._id},
          {$push: {cars: newCar}},
          {new: true})
        .then( user => {
          if(!user) res.send({success: false, msg: 'User not found'});
          else{
            let carId = user.cars[user.cars.length-1]._id;
            console.log(carId);
            res.send({success:true, car: {id: carId}});
          }
        })
        .catch( err => res.send({success: false, msg: 'Error occured while processing query', err: err}) )
  },

  removeCar: function(req, res){
    let id = req.body.car.id;
    console.log("id", id);

    User.findOneAndUpdate(
          {_id: req.user._id},
          {$pull: {cars: {_id: id}}},
          {new: true})
        .then( user => {
          if(!user) res.send({success: false, msg: 'User not found'});
          else{
            console.log('car removed');
            res.send({success: true});
          }
        })
        .catch( err => res.send({success: false, msg: 'Error occured while processing query', err: err}) );
  },


  getCars: function(req, res){
    User.findOne({_id: req.user._id})
        .then( user => {
            if(!user) res.send({success: false, msg: 'User not found'});
            else{
              res.send({success: true, cars: user.cars});
            }
        })
        .catch( err => res.send({success: false, msg: 'Error occured while finding user', err: err}) )
  },

  //=======================
  //     SUBSCRIPTION
  //=======================
  removeRouteSubscription: function(req, res){
    let routeId = req.body.route_id;
    let passengerId = req.user._id;

    Route.findOneAndUpdate(
      {_id: routeId},
      {$pull: {passengers: passengerId}} )
    .then( route =>
      User.findOneAndUpdate(
        {_id: passengerId},
        {$pull: {subscribed_routes: routeId}} )
    )
    .then( user => res.send({success: true}))
    .catch( err => res.send({success: false, err: err}))
  },

  getSubscribedRoutes: function(req, res){
    User.findOne({_id: req.user._id})
        .select('subscribed_routes')
        .populate({
           path: 'subscribed_routes',
           populate: {
             path: '_creator',
             model: 'User'
           }
        })
        .then( user => user.subscribed_routes )
        .then( routes => res.send({success: true, routes: routes}))
        .catch( err => res.send({success: false, err: err}));
  },

  getSubscribedRoutesIds: function(req, res){
    User.findOne({_id: req.user._id})
        .select('subscribed_routes')
        .then( user => user.subscribed_routes )
        .then( routes => {
          console.log('routes', routes);
          res.send({success: true, routes: routes});
      })
        .catch( err => res.send({success: false, err: err}));
  },

  //=======================
  //       RATING
  //=======================

  addRating: function(req, res){
    let value = req.body.rating.value;
    let comment = req.body.rating.comment;
    let targetID = req.body.rating.id;
    let hostID = req.user._id;

    console.log(targetID);

    if(targetID == hostID){
      targetID = null;
      res.send({ success: false });
      return;
    }

    User.findOneAndUpdate(
      { _id: targetID },
      { $push: { ratings:
          {
            value: value,
            comment: comment,
            author: hostID
          } }
      },
      { new: true },
      function(err, user){
        if(err){
          console.log("Error while finding user.");
          res.send({
            success: false
          });
          return;
        }
        if(!user){
          console.log("Error: User not found.")
          res.send({
            success: false
          })
        }
        else if(user){
          console.log("Succes: User found.")
          res.send({
            // comment_id: user.ratings[user.ratings.length-1].id,
            comment: user.ratings[user.ratings.length-1]
          });
        }
      }
    )
  },

  getAvgRating: function(req, res){
    let UserID = req.query.userid;
    User.aggregate([{
      $match: { _id: mongoose.Types.ObjectId(UserID) }},
    {
      $project:{_id: false, RatingsAvg: {$avg: "$ratings.value"}}
    }])
    .exec(
      function(err, values){
        if(err){
        console.log(err)
        res.send({success: false})
        }
        else if(values){
          res.send({success: true, values})
        }
      })
  },

}
