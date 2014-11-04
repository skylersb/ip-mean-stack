
var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'incredipoll');
var PollSchema = require('./poll/pollModel').PollSchema;
var cors = require('cors');
var Poll = db.model('PollSchema', PollSchema);
var bodyParser = require('body-parser');
module.exports.index = function(req, res) {
  res.render('index', {title: 'Polls'});
};


// JSON API for list of polls
module.exports.list = function(req, res) { 
  Poll.find({}, 'question', function(error, polls) {
    res.json(polls);
  });
};
// JSON API for getting a single poll
module.exports.poll = function(req, res) {
  console.log(req.body)  
  var pollId = req.params.id;
  Poll.findById(pollId, '', { lean: true }, function(err, poll) {
    if(poll) {
      var userVoted = false,
      userPollOption,
      totalVotes = 0;
      for(o in poll.pollOptions) {
        var pollOption = poll.pollOptions[o]; 
        for(v in pollOption.votes) {
          var vote = pollOption.votes[v];
          totalVotes++;
          if(vote.ip === (req.header('x-forwarded-for') || req.ip)) {
            userVoted = true;
            userPollOption = { _id: pollOption._id, text: pollOption.text };
          }
        }
      }
      poll.userVoted = userVoted;
      poll.userPollOption = userPollOption;
      poll.totalVotes = totalVotes;
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
  console.log(req.body);
  Poll.findOne({_id: req.params.id}).exec(function(err, poll){
    if(err){
      console.log("ERR is ", err)
      res.send(err)
    }
    if(poll){
      var option = req.body
      for(var i = 0; i < poll.pollOptions.length; i++){
        console.log(poll.pollOptions[i]);
        if(poll.pollOptions[i]._id == option._id){
          console.log('Found Poll Opotion')
          poll.pollOptions[i].votes = option.votes;
        }
      }
      poll.save(function (err) {
        if(err){
          res.send(err)
        } else {
          res.send(poll);
        }
      })
    }
  })
};