const UserController = require('../controllers/user.controller'),
      router = require('express').Router(),
      passport = require('passport');


//AUTHENTICATE
router.post('/register', UserController.postRegister);
router.post('/login', passport.authenticate('local'), UserController.login);

router.post('/changepassword', passport.authenticate('local'), UserController.changePassword);

//USERS
router.get('/getuser', UserController.getUser);

//ROUTES
router.post('/addroute', isLogged, UserController.addRoute);
router.post('/removeroute', isLogged, UserController.removeRoute);
router.get('/getroutes', isLogged, UserController.getUserRoutes);

//CARS
router.post('/addcar', isLogged, UserController.addCar);
router.post('/removecar', isLogged, UserController.removeCar);
router.get('/getcars', isLogged, UserController.getCars);

//SUBSCRIPTION
router.post('/removesub', isLogged, UserController.removeRouteSubscription);
router.get('/getsubscribedroutesids', isLogged, UserController.getSubscribedRoutesIds);
router.get('/getsubscribedroutes', isLogged, UserController.getSubscribedRoutes);


//RATING
router.post('/addrating', isLogged, UserController.addRating);
router.get('/getavgrating', UserController.getAvgRating);

function isLogged(req, res, next){
  console.log(req.isAuthenticated());
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}



module.exports = router;
