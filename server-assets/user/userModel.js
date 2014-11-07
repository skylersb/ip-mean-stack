 "use-strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var User = new Schema({
       userName: {type: String},
       facebookId: {type: String},
       accountCreated: {type: Date},
       email: {type: String},
       admin: {type: Boolean, default:false}
       // myPolls: [ {type: Mongoose.Schema.Types.ObjectId, ref: 'myPolls'} ]
       
})

module.exports = mongoose.model("User", User);