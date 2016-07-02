var express = require('express');

var router = express.Router();
var models = require('../models')
var utils = require('../utils')

router.post('/',function(req,res){
	console.log("POST::activity::got request "+JSON.stringify(req.body));
	var activityData = req.body
	models.activity.save(activityData,function(err,activity){
		if(activity) res.send(activity)
		else res.status(401)
	})
});


router.get('/:authId/:duration',function(req,res){
	console.log("GET::activity::got request "+JSON.stringify(req.body));
	var authId = req.param('authId')
	var duration = req.param('duration')
	models.activity.findActivity(authId,duration,function(err,activities){
		if(activities) res.send(activities)
		else res.status(404).send()
	})
});

module.exports = router;
