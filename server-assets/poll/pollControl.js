var PollModel = require('./pollModel');

module.exports = {
	getPolls: function(req, res){
		PollModel.find().exec(function(err, polls){
			res.send(polls);
		});
	},
	addPoll: function(req, res){
		var newPoll = new PollModel(req.body);
		newPoll.save(function(err){
			if(err){
				res.send(err);
			} else {
				res.status(200).send(req.body.question + ' was sucessfully added to your polls list')
			}
		});
	},
}