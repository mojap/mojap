var express = require('express');

var router = express.Router();
var models = require('../models')
var utils = require('../utils')

router.post('/',function(req,res){
  console.log("POST::activity::got request "+JSON.stringify(req.body));
  var activityData = req.body
  utils.async.waterfall([
    function(callback){
      models.activity.lastActivity(activityData.authId,callback)
    },function(activity,callback){
      console.log('lastActivity::'+JSON.stringify(activity))
      var currentDate = utils.moment()
      var currentDateTillHr = new utils.moment({
        year: currentDate.year(),
        month: currentDate.month(),
        day: currentDate.date(),
        hour: currentDate.hours(),
        minute: 0,
        seconds: 0
      }).utc()
      console.log('currentDateTillHr' + currentDateTillHr.format())
      if(utils._.isUndefined(activity) || utils._.isNull(activity) || utils._.isEmpty(activity)) {
        activityData.beedCount = activityData.beedCountForDay
        activityData.dateTime = currentDateTillHr.format()
      }else{
        //var lastActivity = JSON.parse(JSON.stringify(activity))
        var lastActivity = activity
        //console.log('lastActivityJSON::'+JSON.stringify(lastActivity))
        var lastActivityDate = utils.moment(lastActivity.dateTime)
        console.log("lastActivity::beedCountForDay::"+lastActivity.beedCountForDay+"::beedCount::"+lastActivity.beedCount+",hours::"+lastActivityDate.hours())
        if (currentDateTillHr.hours() == lastActivityDate.hours()) {
          activityData.beedCount = activityData.beedCountForDay - lastActivity.beedCountForDay + lastActivity.beedCount
          activityData.dateTime = lastActivity.dateTime
        } else {
          activityData.beedCount = activityData.beedCountForDay - lastActivity.beedCountForDay
          activityData.dateTime = currentDateTillHr.format()
        }
      }
      console.log('activityData' + JSON.stringify(activityData))
      models.activity.save(activityData,callback)
    }
  ],function(err,activity){
      if(activity) res.send(activity)
      else res.status(401)
  })
});


router.get('/:authId/:duration',function(req,res){
  console.log("GET::activity::got request "+JSON.stringify(req.body));
  var authId = req.param('authId')
  var duration = req.param('duration')
  models.activity.findActivity(authId,duration,function(err,activities){
    if(activities) res.send({value:activities})
    else res.status(404).send()
  })
});

module.exports = router;
