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

var PollSchema = new Schema({
	question: {type: String, required: true},
	pollOptions: [optionSchema]
	// category: {type: String, required: true}
});

module.exports = mongoose.model('PollSchema', PollSchema);