'use strict';
var express = require('express');
var port = 7000;	
var mongoose = require('mongoose');
var PollSchema = require('./server-assets/poll/pollModel')
var db = mongoose.createConnection('localhost', 'incredipoll');
var Poll = db.model('PollSchema', PollSchema);
var routes = require('./server-assets/database');
var bodyParser = require('body-parser');
var cors = require('cors');



//express, bodyParser, cors setup
var app = express();
app.use(cors());
app.use(bodyParser.json());
//ties in the index.html
app.use(express.static(__dirname + '/public'));

//requests
app.get('/', routes.index);
app.get('/polls', routes.list);
app.get('/polls/:id', routes.poll);
app.post('/polls', routes.create);
app.put('/vote/:id', routes.vote);
app.get('/vote/:id', routes.vote);

app.listen(port, function(){
	console.log('Connection Success on mongoDB & http://localhost: ' + port)
});
