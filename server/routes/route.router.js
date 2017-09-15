const RouteController = require('../controllers/route.controller'),
      router = require('express').Router(),
      passport = require('passport');

router.post('/findroutes', RouteController.findRoutes);

module.exports = router;
