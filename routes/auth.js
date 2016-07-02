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
	console.log("got request "+JSON.stringify(req.body));
	models.user.findUser(req.body,function(err,user){
		if(user) res.send(user)
		else res.status(404).send()
	})
});

module.exports = router;
