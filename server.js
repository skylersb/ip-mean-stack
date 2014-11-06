'use strict';
var express = require('express');
var Sesssion = require('express-session');
var port = 3000;	
var mongoose = require('mongoose');
var PollSchema = require('./server-assets/poll/pollModel')
var db = mongoose.createConnection('localhost', 'incredipoll');
var Poll = db.model('PollSchema', PollSchema);
var routes = require('./server-assets/database');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./server-assets/user/userModel');



//express, bodyParser, cors setup
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
//ties in the index.html
app.use(express.static(__dirname + '/public'));


var user = {};
passport.use(new FacebookStrategy({
 clientID: '380054328825864',
 clientSecret: '348682659a6741a449c30aa77ee8a3aa',
 callbackURL: '/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {
	process.nextTick(function(){
		User.findOne({facebookId: profile.id}, function(err, user){
		console.log(err, user, "KDJLKASJLJDFLJDLFJLDSFJLDSJLDJFLJDFSL")
		if(err){
			return done(null, false);
		} else {
			if(user){
				return done(null, user);
			} else {
				var newUser = new User();
				newUser.userName = profile._json.name;
		    newUser.facebookId = profile.id;
		    newUser.accountCreated = profile._json.updated_time;
		    newUser.save(function (err) {
		    	if(err){
		    		return done(err, null);
		    	} else {
		    		return done(null, newUser);
		    	}
		    });
			}
		}
		});
	}); 
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/auth/facebook',
	passport.authenticate('facebook'));


app.get('/auth/facebook/callback',
	passport.authenticate('facebook', {
 successRedirect: '/me',
 failureRedirect: '/'
}), function (req, res) {
	console.log(req.session, 'THis should be the session');
});

app.get('/me', function (req, res) {

	if(req.user){
		res.send(req.user);
	} else {
		res.send("Something went wrong")
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

app.listen(port, function(){
	console.log('Connection Success on mongoDB & ' + port)
});
