 "use-strict";
var Mongoose = require('mongoose');


var User = new Mongoose.Schema({
       userName: {type: String},
       facebookId: {type: String},
       accountCreated: {type: Date},
       email: {type: String},
       admin: {type: Boolean, default:false}
       // myPolls: [ {type: Mongoose.Schema.Types.ObjectId, ref: 'myPolls'} ]
       
})

module.exports = Mongoose.model("User", User);