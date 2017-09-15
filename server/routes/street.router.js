const StreetController = require('../controllers/street.controller'),
      router = require('express').Router(),
      passport = require('passport');

router.get('/findlike', StreetController.findStreetsLike);

module.exports = router;
