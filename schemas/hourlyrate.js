//hourlyrate.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HourlyRateSchema = new Schema({
	rate: Number
});

module.exports = mongoose.model('HourlyRate', HourlyRateSchema);