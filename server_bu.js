var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Utils = require('./utils/utils');
var Owner = require('./schemas/owner');
var User = require('./schemas/user');
var port = process.env.PORT || 3000;
var router = express.Router();
var jwt = require('jwt-simple');
app.use(bodyParser());
var mongoose = require('mongoose');
app.use('/api', router);
app.set('jwtTokenSecret', '');
mongoose.connect('mongodb://localhost/fww');
/* *********************
 * ROUTES
 * ******************** */
router.route('/login')
	.post (function(req,res){
		var username = req.body.username;
		var pass = req.body.pass;
	  User.findOne({ username: username }, function(err, user) {
		  if (err) { 
		    // user not found 
		    return res.send(401);
		  }
 
		  if (!user) {
		    // incorrect username
		    return res.send(401);
		  }
 
		  if (user.pass !== pass) {
		    // incorrect password

		    return res.send(401);
		  }
 
		  // User has authenticated OK
		  res.send(200);
	  });
	});

router.route('/owners')

	.post(function(req,res){
		var owner = new Owner();

		owner.firstName = req.body.firstName;
		owner.lastName = req.body.lastName;
		owner.email = req.body.email;

		owner.save(function(err){
			if (err) res.send(err);
			res.json({message: 'Owner created!'});
		});
	})
	
	.get(function(req,res){
		Owner.find(function(err, owners) {
			if (err)
				res.send(err);
			res.json({Owners: owners});
		});
	});



router.route('/owners/remove/:owner_id')
	.delete(function(req, res) {
		Owner.remove({
			_id: req.params.owner_id
		}, function(err, bear) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	})

	.put(function(req, res) {

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
	});


app.listen(port);