//store.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Utils = require('../utils/utils');

var StoreSchema = new Schema({
	storeName: String,
	email: String,
	address: String,
	defaultDiscountId: String

});

module.exports = mongoose.model('Store', StoreSchema);