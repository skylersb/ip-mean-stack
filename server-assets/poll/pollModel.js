'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var voteSchema = new Schema({
	ip: 'String'
});

var optionSchema = new Schema({
	text: String,
	votes: {type: Number, default: 0},
	voted: [voteSchema]
});

var Poll = new Schema({
	question: {type: String, required: true},
	pollOptions: [optionSchema],
	allVotes: {type: Number, default: 0}
	// category: {type: String, required: true}
});

module.exports = mongoose.model('Poll', Poll);