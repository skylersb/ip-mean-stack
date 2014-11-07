'use strict';
var express = require('express');
var Session = require('express-session');
var port = 3000;	
var mongoose = require('mongoose');
var PollSchema = require('./server-assets/poll/pollModel');
// var db = mongoose.createConnection('localhost', 'testing');
var Poll = require('./server-assets/poll/pollModel');
var routes = require('./server-assets/database');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./server-assets/user/userModel');

var db = 'mongodb://localhost/incredipoll';
var connection = mongoose.connection;



//express, bodyParser, cors setup
var app = express();
app.use(cors());
app.use(Session({
	secret: "whatevertheheckIwantontuesdayinjuly",
	name: 'DaPolls',
	proxy: true,
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
//ties in the index.html
app.use(express.static(__dirname + '/public'));


var user = {};
passport.use('facebook', new FacebookStrategy({
 clientID: 'FACEBOOK_APP_ID',
 clientSecret: 'FACEBOOK_SECRET_ID',
 callbackURL: '/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {
		process.nextTick(function(){
			User.findOne({facebookId: profile.id}, function(err, user){
			if(err) {console.log(err);}
			if(!err && user != null){
					done(null, user);
				} else {
					var newUser = new User();
					newUser.userName = profile._json.name;
			    newUser.facebookId = profile.id;
			    newUser.accountCreated = profile._json.updated_time;
			    newUser.save(function (err) {
			    	if(err){
			    	  console.log(err);
			    	} else {
			    		done(null, newUser);
			    	}
			    });
				}
			}); 
		});
}));


passport.serializeUser(function(user, done) {
console.log('serializing', user)
done(null, user);
});

passport.deserializeUser(function(user, done) {
//console.log('deserializing ', user)
done(null, user);
});

// passport.serializeUser(function(user, done) {
//  console.log('serializeUser: ' + user._id)
//  done(null, user._id);
// });
// passport.deserializeUser(function(id, done) {
//  User.findById(id, function(err, user){
//      console.log(user)
//      if(!err) done(null, user);
//      else done(err, null)
//  })
// });

app.get('/auth/facebook',
	passport.authenticate('facebook'));


app.get('/auth/facebook/callback',
	passport.authenticate('facebook', {
 failureRedirect: '/#/login',
 successRedirect: '/me'
}));

app.get('/me', function (req, res) {

	if(req.user){
		res.cookie('pollUser', JSON.stringify(req.user));
		res.redirect('/#/polls');
	} else {
		res.redirect('/#/login');
	}
})

// app.get('/me', function(req, res){
// 	console.log(user.id);
//    User.findOne({'facebookId': user.id}).exec(function(err, user){
//       console.log(err, "There was an Error?");
//       console.log(user, "A user was returned?")
//       if(err){
//       	res.send(err);
//       } else {
//       	if(user){
//       		res.status(200).send(user);
//       	} else {
//    				new User({
// 		       userName: req.user._json.name,
// 		       facebookId: req.user.id,
// 		       accountCreated: req.user._json.updated_time
// 		     }).save(function(err){
// 		       if(err){
// 		         console.log("couldn't save newFB user", err);
// 		       } else {
// 		         res.status(200).send(user); 
// 		         //this should be sending back the data after it is saved- test late	        
// 	      	 }  
//    			});
// 		  }
// 		}
// 	});
// });



app.get('/logout', function(req, res){
 req.logout();
 req.session.destroy();
 res.redirect('/');
});

var requireAuth = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).end();
  }
  next();
};

//requests
app.get('/', routes.index);
app.get('/polls', routes.list);
app.get('/polls/:id', routes.poll);
app.post('/polls', routes.create);
app.put('/vote/:id', routes.vote);
app.get('/vote/:id', routes.vote);



mongoose.connect(db);
	connection.once('open', function () {
		console.log('Actually connected to our DB');

	// app.listen(port, function(){
	// 	console.log('Connection Success on mongoDB & ' + port)
	// });
	app.listen(process.env.EXPRESS_PORT || 3000)
})

