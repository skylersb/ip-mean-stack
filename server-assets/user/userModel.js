 "use-strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var User = new Schema({
       userName: {type: String},
       facebookId: {type: String},
       accountCreated: {type: Date},
       email: {type: String},
       admin: {type: Boolean, default:false},
       votedPolls: [ {type: mongoose.Schema.Types.ObjectId, ref: 'PollSchema'} ],
       myPolls: [ {type: mongoose.Schema.Types.ObjectId, ref: 'PollSchema'} ]

       
})

module.exports = mongoose.model("User", User);