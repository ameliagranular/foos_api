/* *********************
 * middleware
 * ******************** */
var express = require('express');
var moment = require('moment');
var app = express();
var bodyParser = require('body-parser');
var Utils = require('./utils/utils');
var Owner = require('./schemas/owner');
var User = require('./schemas/user');
var Store = require('./schemas/store');
var HourlyRate = require('./schemas/hourlyrate');
var Instrument = require('./schemas/instrument');
var Repair = require('./schemas/repair');
var Discount = require('./schemas/discount');
var port = process.env.PORT || 3000;
var router = express.Router();
var mongoose = require('mongoose');
var jsonp = require('jsonp-express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var lusca = require('lusca');
/* *********************
 * aap config
 * ******************** */
app.use(bodyParser());

app.use('/api', router);
app.use(jsonp);
app.use(cookieParser());

app.use(session({ secret: "", expires : new Date(Date.now() + 3600000)}));
app.use(lusca.csrf("x_csrf"));

function handleErrors(err,req,res,next){
	console.log(err);

	if (err == "Error: CSRF token mismatch") {
		res.set('X-Wild-CSRF',res.locals._csrf);
		res.send(403, {error: "There was a problem completing your request"});
	} else {
		res.send(403);
	}
}
app.use(handleErrors);


app.use(function(req,res,next) {

	app.locals.csrf = res.locals._csrf;
	
	next();
});


mongoose.connect('mongodb://localhost/fww');



/* *********************
 * ROUTES
 * ******************** */

 router.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "x-access-token, Content-Type");
  next();
 });

/* LOGIN */
app.route('/login')
	.post (function(req,res){
		
		var username 	= req.body.username;
		var pass 		= req.body.pass;
		var hashedPass = pass != null ? Utils.getHashed(pass): null

	  	User.findOne({ username: username }, function(err, user) {
	  	
			if (err) { 
			   return res.send(401, err);
			}

			if (!user) {
			  	res.set('WWW-Authenticate', 'Basic realm="Secure Area"')
			  	return res.send(401, { error: 'user not found' });			  
			}
	 
		 	if (hashedPass == null || user.pass != hashedPass){
			    return res.send(401, { error: 'error logging in' });
			}
			
			else  {
				res.json({
					token: app.locals.csrf,
					user: {
						username: user.username,
						firstName: user.firstName,
						lastName: user.lastName
					}
				});
			}
		 
	  	});
	})
	.get (function(req,res){
		var username 	= req.query.username;
		var pass 		= req.query.pass;
		var cb 			= req.query.callback;
		var hashedPass = pass != null ? Utils.getHashed(pass): null
	  	User.findOne({ username: username }, function(err, user) {
	  	
			if (err) { 
			   return res.send(401, err);
			}

			if (!user) {
			  	return res.send(401, { error: 'user not found' });			  
			}
	 
		 	if (hashedPass == null || user.pass != hashedPass){
			    return res.send(401, { error: 'error logging in' });
			}

			else if (cb != null) {
							  	

				res.jsonp({
					token: app.locals.csrf,
					username: user.username
				});
			}
			
		 
	  	});
	});

app.route('/user/current')
	.post (function(req,res) {
		if (Utils.validateCsrf(req, app.locals.csrf) ) {
			res.json({
					
					username: user.username
			});
		}
		else {

		}
	});

app.route('/user/create')
	.post (function(req,res) {

		var username 	= req.body.username;
		var firstName 	= req.body.firstName;
		var lastName 	= req.body.lastName;
		var up 			= req.body.up;
		var up_conf 	= req.body.up_conf;
		var pass;

		var user = new User();
		if (!Utils.validatePass(up)) {
			res.send(404, 'Invalid password. User not created.');
		}

		else if (up !== up_conf) {
			res.send(404, 'Passwords do not match. User not created.');
		}

		else {
			user.pass = Utils.getHashed(up);
			user.username = username;
			user.firstName = firstName;
			user.lastName = lastName;
			user.admin = true;
			if (user.pass !== null && user.pass > 0) {
				user.save(function(err) {
					if (err)
						res.send(err);

					res.json({ message: 'User created!' });
				});
			}
		}


	});


router.route('/users')

	.get(function(req,res){
		if (Utils.validateCsrf(req, app.locals.csrf) ) {
			User.find(function(err, users) {
				if (err)
					res.send(err);
				res.json({users: users});
			});
		}
		else {
			res.send(401);
		}
		
	});


 /* OWNERS */
router.route('/owners')

	
	.get(function(req,res){
		if (Utils.validateCsrf(req, app.locals.csrf) ) {

			Owner.find(function(err, owners) {
				if (err)
					res.send(err);
				res.json({owners: owners});
			});
		}
		else {
			res.send(401);
		}
	});

 /* OWNERS */
router.route('/owners/:owner_id')

	
	.get(function(req,res){
		if (Utils.validateCsrf(req, app.locals.csrf) ) {

			Owner.findById(req.params.owner_id, function(err, owner) {
				if (err)
					res.send(err);
				res.json({owner: owner});
			});
		}
		else {
			res.send(401);
		}
	});

router.route('/owners/add')

	.post(function(req,res){
		if (Utils.validateCsrf(req, app.locals.csrf) ) {
			var owner = new Owner();
			
			owner.firstName = req.body.firstName;
			owner.lastName = req.body.lastName;
			owner.email = req.body.email;
			owner.address = req.body.address;
			owner.save(function(err){
				if (err) res.send(err);
				res.json({owner: owner});
			});
		}
		else {
			res.send(401);
		}
	});

router.route('/owners/remove/:owner_id')
	.delete(function(req, res) {
		if (Utils.validateCsrf(req, app.locals.csrf) ) {
			Owner.remove({
				_id: req.params.owner_id
			}, function(err, bear) {
				if (err)
					res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		}
		else {
			res.send(401);
		}

	})

	.put(function(req, res) {
		if (Utils.validateCsrf(req, app.locals.csrf) ) {

			Owner.findById(req.params.owner_id, function(err, owner) {

				if (err)
					res.send(err);

				owner.firstName = req.body.firstName;
				owner.lastName = req.body.lastName;
				owner.email = req.body.email;


				owner.save(function(err) {
					if (err)
						res.send(err);

					res.json({ message: 'Owner updated!' });
				});

			});
		}
		else {
			res.send(401);
		}

	});


/* STORES */
router.route('/stores/add')

	.post(function(req,res){
		if (Utils.validateCsrf(req, app.locals.csrf) ) {
			var store = new Store();
			
			store.storeName = req.body.storeName;
			store.email = req.body.email;

			store.save(function(err){
				if (err) res.send(err);
				res.json({message: 'Store created!'});
			});
		}
		else {
			res.send(401);
		}
	});

router.route('/stores')
	
	
	.get(function(req,res){
		if (Utils.validateCsrf(req, app.locals.csrf) ) {

			Store.find(function(err, stores) {
				if (err)
					res.send(err);
				res.json({Stores:stores});
			});
		}
		else {
			res.send(401);
		}
	});


 /* OWNERS */
router.route('/stores/:store_id')

	
	.get(function(req,res){
		if (Utils.validateCsrf(req, app.locals.csrf) ) {

			Store.findById(req.params.store_id, function(err, store) {
				if (err)
					res.send(err);
				res.json({Store: store});
			});
		}
		else {
			res.send(401);
		}
	});


router.route('/stores/remove/:store_id')
	.delete(function(req, res) {
		if (Utils.validateCsrf(req, app.locals.csrf) ) {
			Store.remove({
				_id: req.params.store_id
			}, function(err, bear) {
				if (err)
					res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		}
		else {
			res.send(401);
		}

	})

	;


/* HOURLY RATE */
router.route('/rates')
	.get(function(req,res){
		if (Utils.validateCsrf(req, app.locals.csrf) ) {

			HourlyRate.find(function(err, rates) {
				if (err)
					res.send(err);
				res.json({Rates: rates});
			});
		}
		else {
			res.send(401);
		}
	});


/* DISCOUNTS */

router.route('/discounts/add')

	.post(function(req,res){
		if (Utils.validateCsrf(req, app.locals.csrf) ) {
			var discount = new Discount();
			
			discount.name = req.body.name;
			discount.percentage = req.body.percentage;

			discount.save(function(err){
				if (err) res.send(err);
				res.json({message: 'discount created!'});
			});
		}
		else {
			res.send(401);
		}
	});

router.route('/discounts')
	.get(function(req,res){
				//console.log("getting discount rates");

		if (Utils.validateCsrf(req, app.locals.csrf) ) {

			Discount.find(function(err, discounts) {
				if (err)
					res.send(err);
				res.json({Discounts: discounts});
			});
		}
		else {
			res.send(401);
		}
	});


/* REPAIRS */
router.route('/repairs/add')
	.post(function(req,res){

		if (Utils.validateCsrf(req, app.locals.csrf) ) {
			var repair = new Repair();

			repair.date = req.body.date;
			repair.instrumentId = req.body.instrumentId;
			repair.finalCost = req.body.finalCost;
			repair.hours = req.body.hours;
			repair.materialsCost = req.body.materialsCost;
			repair.discountId = req.body.discountId;
			repair.ownerId = req.body.ownerId;
			repair.storeId = req.body.storeId;
			repair.estimate = req.body.estimate;
			repair.invoiced = req.body.invoiced;
			repair.hourlyRateId = req.body.hourlyRateId;
			repair.flatFee = req.body.flatFee;

			repair.save(function(err){
				if (err) res.send(err);
				res.json({message: 'Repair created!'});
			});
		}
		else {
			res.send(401);
		}
	})

router.route('/repairs')
	
	.get(function(req,res){
		if (Utils.validateCsrf(req, app.locals.csrf) ) {

			Repair.find(function(err, repairs) {
				if (err)
					res.send(err);
				res.json({repairs:repairs});
			});
		}
		else {
			res.send(401);
		}
	});

router.route('/repairs/owner/:owner_id')


	.get(function(req, res) {
			if (Utils.validateCsrf(req, app.locals.csrf) ) {

				Repair.find({ownerId: req.params.owner_id}, function(err, repairs) {
					
					if (err)
						res.send(err);

					else 
						res.json({repairs: repairs});
					

				});
			}
			else {
				res.send(401);
			}

		});

/* INSTRUMENT */
router.route('/instruments')
	.get(function(req,res){
		if (Utils.validateCsrf(req, app.locals.csrf) ) {

			Instrument.find(function(err, instruments) {
				if (err)
					res.send(err);
				res.json({instruments: instruments});
			});
		}
		else {
			res.send(401);
		}
	});


router.route('/instruments/add')
	.post(function(req,res){

		if (Utils.validateCsrf(req, app.locals.csrf) ) {
			var instrument = new Instrument();
			instrument.make = req.body.make;
			instrument.model = req.body.model;
			instrument.serialNum = req.body.serialNum;
			instrument.instrType = req.body.instrType;
			instrument.ownerId = req.body.ownerId;
			
			instrument.save(function(err, instrument){
				if (err) res.send(err);
				res.json({Instrument: instrument});
			});
		}
		else {
			res.send(401);
		}
	});

router.route('/instruments/owner/:owner_id')


	.get(function(req, res) {
			if (Utils.validateCsrf(req, app.locals.csrf) ) {

				Instrument.find({ownerId: req.params.owner_id}, function(err, instruments) {
					if (err)
						res.send(err);

					else
						res.json({instruments: instruments});
					
				});
			}
			else {
				res.send(401);
			}

		});

router.route('/instruments/store/:store_id')


	.get(function(req, res) {
			if (Utils.validateCsrf(req, app.locals.csrf) ) {

				Instrument.find({ownerId: req.params.store_id}, function(err, instruments) {

					if (err)
						res.send(err);

					else if (instruments != null)
						res.json({Instruments: instruments});
					else 
						res.json({message: "none found", store_id:req.params.store_id});

				});
			}
			else {
				res.send(401);
			}

		});
router.route('/instruments/:instrument_id')


	.get(function(req, res) {
			if (Utils.validateCsrf(req, app.locals.csrf) ) {

				Instrument.findOne(req.params.instrument_id, function(err, instrument) {

					if (err)
						res.send(err);

						res.json({Instrument: instrument});

				});
			}
			else {
				res.send(401);
			}

		});




app.listen(port);