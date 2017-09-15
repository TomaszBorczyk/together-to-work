const AuthController = require('../controllers/auth.controller'),
      router = require('express').Router(),
      passport = require('passport');

router.get('/facebook/login', AuthController.facebookLogin);
router.get('/facebook/callback', AuthController.facebookCallback);

router.get('/google/login', AuthController.googleLogin);
// router.get('/google/callback', passport.authenticate('google'), AuthController.googleCallback);
router.get('/google/callback', AuthController.googleCallback);

router.get('/logout', AuthController.logout);
router.get('/curr', AuthController.currentUser);

router.get('/isloggedin', AuthController.isLoggedIn);

module.exports = router;
