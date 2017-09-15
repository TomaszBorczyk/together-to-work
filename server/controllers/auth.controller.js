const passport = require('passport'),
      User = require('../models/user.model');


module.exports = {

  //passport function for user creation/loggin in via facebook
  facebookRegister: function(accessToken, refreshToken, profile, done){
    console.log('FacebookStrategy()', profile);
    User.findOne( {'facebook.id': profile.id })
        .then( user => {
             if(!user){
               //create new user
               console.log(profile._json);
               let email = profile.email ? profile.email : null;

               let newUser = new User({
                 username: profile.displayName,
                 facebook: profile._json,
                 email: email,
               });
               console.log(newUser);
               newUser.save()
                      .then( () => done(null, user))
                      .catch( err => done(err))
             } else {
               console.log(user);
               return done(null, user);
             }
        })
        .catch( err => done(err) );

  },

  googleRegister: function(token, tokenSecret, profile, done) {
    console.log('googleStrategy()', profile);
    User.findOne( {'google.id': profile.id })
        .then( user => {
             if(!user){
               //create new user
               console.log('registering user', profile._json);
               let email = profile.email ? profile.email : null;

               let newUser = new User({
                 username: profile.displayName,
                 google: profile._json,
               });
               console.log('user registered', newUser);
               newUser.save()
                      .then( () => done(null, user))
                      .catch( err => done(err));

             } else {
               console.log('user exists', user);
               return done(null, user);
             }
        })
        .catch( err => done(err) )
       },

  //callback for passport FacebookStrategy
  facebookCallback: passport.authenticate('facebook',
                                            {
                                              successRedirect: '/',
                                              failureRedirect: '/',
                                            }),

  googleCallback: passport.authenticate('google',
                                            {
                                              successRedirect: '/',
                                              failureRedirect: '/',
                                            }),

  facebookLogin: passport.authenticate('facebook'),

  googleLogin: passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }),


  logout: function(req, res){
    console.log('LOGOUT');
    req.logout();
    res.redirect('/');
  },

  currentUser: function(req, res, next){
    if(req.isAuthenticated()){
      console.log('AUTHENTICATED', req.user);
      res.send( req.user );
    } else{
      console.log('NOT AUTHENTICATED');
      res.send( {});
    }
  },

  isLoggedIn: function(req, res){
    res.send(req.isAuthenticated());
  }

}
