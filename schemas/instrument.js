//instrument.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InstrumentSchema = new Schema({
	make: String,
	model: String,
	serialNum: String,
	instrType: String,
	ownerId: String
	

});

module.exports = mongoose.model('Instrument', InstrumentSchema);