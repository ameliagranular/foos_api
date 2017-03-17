//repair.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RepairSchema = new Schema({
	date: Date,
	instrumentId: String,
	finalCost: Number,
	comments: String,
	hours: Number,
	flatFee: Number,
	hourlyRateId: String,
	materialsCost: Number,
	discountId: String,
	ownerId: String,
	storeId: String,
	estimate: Boolean,
	invoiced: Boolean
});

module.exports = mongoose.model('Repair', RepairSchema);