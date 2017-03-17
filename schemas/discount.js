//discount.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DiscountSchema = new Schema({
	name: String,
	percentage: Number
});

module.exports = mongoose.model('Discount', DiscountSchema);