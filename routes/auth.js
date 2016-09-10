var express = require('express');

var router = express.Router();
var models = require('../models')
var utils = require('../utils')

router.post('/register',function(req,res){
	console.log("got request "+JSON.stringify(req.body));
	var userData = req.body
	userData.password = utils.uuid.randomUUID()
	models.user.save(req.body,function(err,user){
		if(user) res.send(user)
		else res.status(401)
	})
});


router.post('/login',function(req,res){
	utils.async.waterfall([
		function(callback){
			models.user.findUser(req.body,callback)
		},function(user,callback) {
			if(user) return callback(null, user)
			else models.user.saveUser(req.body,callback)
		},function(userDB,callback){
			models.activity.totalBeeds(userDB.authId,function(err,data){
				if(!err) {
					var userLocal = JSON.parse(JSON.stringify(userDB))
					console.log("login::userDB"+JSON.stringify((userDB)))
					userLocal.totalBeeds = data[0].beedCount
					return callback(null,userLocal)
				}else return callback(err,null)
			})
		}
	],function(err, loggedInUser){
		if(loggedInUser) res.send(loggedInUser)
		else res.status(401)
	})
});

module.exports = router;
