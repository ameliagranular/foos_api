//owners.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Utils = require('../utils/utils');

var OwnerSchema = new Schema({
	firstName: { type: String, validate: Utils.validate },
	lastName: { type: String, validate: Utils.validate },
	email: { type: String, validate: Utils.validateEmail },
	address: {type:String, validate: Utils.validate}
});


module.exports = mongoose.model('Owner', OwnerSchema);