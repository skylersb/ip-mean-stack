'use strict';
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Session = require('express-session');
var port = 3000;	
var mongoose = require('mongoose');
var Poll = require('./server-assets/poll/pollModel');
var routes = require('./server-assets/database');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LinkedInStrategy = require('passport-linkedin').Strategy;
var User = require('./server-assets/user/userModel');

var db = 'mongodb://localhost/incredipoll';
var connection = mongoose.connection;



//express, bodyParser, cors setup

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
 clientID: process.env.FACEBOOK_APP_ID || '380054328825864',
 clientSecret: process.env.FACEBOOK_SECRET_ID || '348682659a6741a449c30aa77ee8a3aa',
 callbackURL: '/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {
		process.nextTick(function(){
			User.findOne({facebookId: profile.id}, function(err, user){
			if(err) {console.log(err)}
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
	}
));

passport.use('twitter', new TwitterStrategy({
	  consumerKey: process.env.TWITTER_CONSUMER_KEY || 'ayWV5ayZ8uQpjGGmFYv7mektJ',
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET || '7h7Iy3k83XF9QKx3urIiQrqHg48zgIpgjIIHkcRKQJ0vJt78Gb',
    callbackURL: '/auth/twitter/callback'
  }, function(token, tokenSecret, profile, done) {
  	process.nextTick(function(){
	    User.findOne({twitterId: profile.id}, function(err, user) {
	      if (err) { console.log(err)}
	      if(!err && user != null){
	      	done(null, user);
	      } else {
	      	var newUser = new User();
						newUser.userName = profile._json.name;
				    newUser.twitterId = profile.id;
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
	}
));

passport.use('google', new GoogleStrategy({
	  clientID: process.env.GOOGLE_CLIENT_ID || '678792511059-96h105n1i1dqp35a1oaace5qvbg94jpe.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'gYqg_xHM2VfnPO6ReDQvS8yQ',
    callbackURL: '/auth/google/callback'
  }, function(accessToken, refreshToken, profile, done) {
  	process.nextTick(function(){
	    User.findOne({googleId: profile.id}, function(err, user) {
	      if (err) { console.log(err)}
	      if(!err && user != null){
	      	done(null, user);
	      } else {
	      	var newUser = new User();
						newUser.userName = profile.displayName;
				    newUser.googleId = profile.id;
				    newUser.accountCreated = profile.time;
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
	}
));

passport.use('linkedin', new LinkedInStrategy({
	  consumerKey: process.env.LINKEDIN_CONSUMER_KEY || '75nliyrnqlnjw4',
    consumerSecret: process.env.LINKEDIN_CONSUMER_SECRET || 'NbU9IGA4wOn4clDY',
    callbackURL: '/auth/linkedin/callback'
  }, function(token, tokenSecret, profile, done) {
  	process.nextTick(function(){
	    User.findOne({linkedinId: profile.id}, function(err, user) {
	      if (err) { console.log(err)}
	      if(!err && user != null){
	      	done(null, user);
	      } else {
	      	var newUser = new User();
						newUser.userName = profile._json.name;
				    newUser.linkedinId = profile.id;
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
	}
));




passport.serializeUser(function(user, done) {
console.log('serializing', user)
done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id).exec(function(err, user){
		done(err, user);
	})
//console.log('deserializing ', user)
// done(null, user);
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

//Facebook redirect
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
 failureRedirect: '/#/login',
 successRedirect: '/#/polls'
}));

//Twiter redirect
app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', passport.authenticate('twitter', {
	failureRedirect: '/#/login',
	successRedirect: '/#/polls'
}));

//Google Redirect
app.get('/auth/google', passport.authenticate('google', 
	{ scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
}));

app.get('/auth/google/callback', passport.authenticate('google', {
	failureRedirect: '/#/login',
	successRedirect: '/#/polls'
}));

//LinkedIn Redirect
app.get('/auth/linkedin', passport.authenticate('linkedin'));

app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
	failureRedirect: '/#/login',
	successRedirect: '/#/polls'
}));



app.get('/me', function (req, res) {

	// if(req.user){
	// 	res.json(req.user);
	// 	res.redirect('/#/polls');
	// } else {
	// 	res.redirect('/#/login');
	// }
	return res.json(req.user);
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
app.get('/polls', requireAuth, routes.list);
app.get('/polls/:id', requireAuth, routes.poll);
app.post('/polls', requireAuth, routes.create);
app.put('/vote/:id', requireAuth, routes.vote);
app.get('/vote/:id', requireAuth,routes.vote);

io.on('connection', function(socket){
	console.log('Connection made!')

	socket.emit('connection')

	socket.on('joinRoom', function(room){
		socket.join(room);
	});

	socket.on('pollCreated', function(){
		io.to('mainRoom').emit('pollCreated');
	});

socket.on('joinRoom', function(room){
		socket.join(room);
	

socket.on('voted', function(room){
	io.to(room).emit('voted')
	// socket.join('joinRoom', function(err, room){
	// 		io.sockets.to(room).emit('voted')
	// 	})
})
});

})

mongoose.connect(db);
	connection.once('open', function () {
		console.log('Actually connected to our DB');

	
	server.listen(process.env.EXPRESS_PORT || 3000, function(){
		console.log('Connection Success on mongoDB & ' + 3000)
	});
})
