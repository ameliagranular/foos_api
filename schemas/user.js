//owners.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Utils = require('../utils/utils');


var UserSchema = new Schema({
	username: {type:String, validate:Utils.validate},
	firstName: {type:String, validate: Utils.validate},
	lastName: {type: String, validate: Utils.validate},
	pass: {type:String, validate: Utils.validate},
	admin: Boolean
	
});

module.exports = mongoose.model('User', UserSchema);