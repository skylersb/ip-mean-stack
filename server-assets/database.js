
var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'incredipoll');
var Poll = require('./poll/pollModel');
var cors = require('cors');
var bodyParser = require('body-parser');
var User = require('./user/userModel');
module.exports.index = function(req, res) {
  res.render('index', {title: 'Polls'});
};


// JSON API for list of polls
module.exports.list = function(req, res) { 
  Poll.find().exec(function(error, polls) {
    res.json(polls);
  });
};
// JSON API for getting a single poll
module.exports.poll = function(req, res) {
  console.log(req.body)  
  var pollId = req.params.id;
  Poll.findById(pollId, '', { lean: true }, function(err, poll) {
    if(poll) {
      // var userVoted = false,
      // userPollOption,
      // totalVotes = 0;
      // for(o in poll.pollOptions) {
      //   var pollOption = poll.pollOptions[o]; 
      //   for(v in pollOption.votes) {
      //     var vote = pollOption.votes[v];
      //     totalVotes++;
      //     if(vote.ip === (req.header('x-forwarded-for') || req.ip)) {
      //       userVoted = true;
      //       userPollOption = { _id: pollOption._id, text: pollOption.text };
      //     }
      //   }
      // }
      // poll.userVoted = userVoted;
      // poll.userPollOption = userPollOption;
      // poll.totalVotes = totalVotes;
      res.json(poll);
    } else {
      res.json({error:true});
    }
  });
};
// JSON API for creating a new poll
module.exports.create = function(req, res) {
  console.log(req.body)
  var reqBody = req.body,
  pollOptions = reqBody.pollOptions.filter(function(v) { return v.text != ''; }),
  pollObj = {question: reqBody.question, pollOptions: pollOptions};
  var poll = new Poll(pollObj);
  poll.save(function(err, doc) {
    if(err || !doc) {
      throw 'Error' + err;
    } else {
      res.json(doc);
    }   
  });
};



module.exports.vote = function(req, res) {
  console.log(req.body)
  console.log(req.user)
  Poll.findOne({_id: req.params.id}).exec(function(err, poll){
    if(err){
      console.log("ERR is ", err)
      res.send(err)
    }
    if(poll){
      var option = req.body
      for(var i = 0; i < poll.pollOptions.length; i++){
        // console.log(poll.pollOptions[i]);
        if(poll.pollOptions[i]._id == option._id){
          // console.log('Found Poll Option')
          poll.pollOptions[i].votes = option.votes;
        }
      }
     
      User.findByIdAndUpdate(
        req.user._id,
        {$push: {"votedPolls": poll._id}},
        {upsert:false},
        function(err, user){
          if(err){
              console.log(err);
          }else{
              // console.log("Successfully added");
              console.log("Successfully added to: " + user);
              var currentUser = user;
              poll.allVotes++;

                poll.save(function (err) {
        if(err){
          res.send(err)
        } else {
          // res.send(poll);
          res.json(currentUser.votedPolls);
        }
      })
          }
        }
      );
      // req.user.save(function (err){
      //   if(err){
      //     console.log(err);
      //   }
      // })
    
    }
  })
};