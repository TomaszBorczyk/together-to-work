const express = require('express'),
			cors = require('cors');
			path = require('path'),
			bodyParser = require('body-parser'),
			mongoose = require('mongoose'),
			cookieParser = require('cookie-parser'),
			passport = require('passport'),
			localStrategy = require('passport-local').Strategy,
			FacebookStrategy = require('passport-facebook').Strategy,
			GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const config = require('./server/config/config')


const port = process.env.PORT || 4567;
console.log(port);
let app = express();


//static folder
app.use(express.static(path.join(__dirname, 'dist')));

//app configuration
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(require('express-session')({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false
}));


//passport configuration
let User = require('./server/models/user.model');
passport.use(new localStrategy(User.authenticate()));


//custom implementation of serialization/deserialization, default one was searching user by username, which is not unique
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

//facebook passport
const AuthController = require('./server/controllers/auth.controller');
passport.use(new FacebookStrategy({
    clientID: '120455715263636',
    clientSecret: 'c9b690ca38ae6b1a6a661d8d5a90de0c',
    callbackURL: "http://localhost:4567/api/v1/auth/facebook/callback"
  },
	AuthController.facebookRegister
));

//google passport
passport.use(new GoogleStrategy({
    clientID: '707927712140-4pufpsqbgv2e5si7j21fi6no80jj7pb4.apps.googleusercontent.com',
    clientSecret: 'Ld8Su4XmrOgO_ki_cZFplZVC',
		callbackURL: "http://localhost:4567/api/v1/auth/google/callback"
  },
	AuthController.googleRegister
));

//adding routes
const userRouter = require('./server/routes/user.router');
const authRouter = require('./server/routes/auth.router');
const routeRouter = require('./server/routes/route.router');
const streetRouter = require('./server/routes/street.router');
const requestRouter = require('./server/routes/request.router');

app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/route', routeRouter);
app.use('/api/v1/street', streetRouter);
app.use('/api/v1/request', requestRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//connecting to database and listening on port
mongoose.connect(config.db);
if(!module.parent){
  app.listen(port);
}
console.log('App runs in develop mode');

module.exports = app;
