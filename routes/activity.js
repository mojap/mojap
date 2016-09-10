var express = require('express');

var router = express.Router();
var models = require('../models')
var service = require('../service')
var utils = require('../utils')

router.post('/',function(req,res){
  console.log("POST::activity::got request "+JSON.stringify(req.body));
  var activityData = req.body
  var offset = req.param('offset')
  console.log("activity::create::"+offset)
  utils.async.waterfall([
    function(callback){
      models.activity.lastActivity(activityData.authId,offset,callback)
    },function(activity,callback){
      console.log('lastActivity::'+JSON.stringify(activity))

      var currentDateTillHr = utils.moment.utc().format('YYYY-MM-DDTHH:00:00') //utils.moment().utc().format('YYYY-MM-DDTHH:00:00')
      console.log('currentDateTillHr' + currentDateTillHr)
      if(utils._.isUndefined(activity) || utils._.isNull(activity) || utils._.isEmpty(activity)) {
        activityData.beedCount = activityData.beedCountForDay
        activityData.dateTime = currentDateTillHr
      }else{
        //var lastActivity = JSON.parse(JSON.stringify(activity))
        var lastActivity = activity
        //console.log('lastActivityJSON::'+JSON.stringify(lastActivity))
        var lastActivityDate = utils.moment(lastActivity.dateTime).format('YYYY-MM-DDTHH:00:00')
        console.log("lastActivity::beedCountForDay::"+lastActivity.beedCountForDay+"::beedCount::"+lastActivity.beedCount+",lastActivityDate::"+lastActivityDate)
        if (currentDateTillHr == lastActivityDate) {
          activityData.beedCount = activityData.beedCountForDay - lastActivity.beedCountForDay + lastActivity.beedCount
          activityData.dateTime = lastActivity.dateTime
        } else {
          activityData.beedCount = activityData.beedCountForDay - lastActivity.beedCountForDay
          activityData.dateTime = currentDateTillHr
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

router.post('/reset',function(req,res){
  console.log("POST::activity::reset::got request "+JSON.stringify(req.body));
  var resetData = req.body
  var offset = req.param('offset')
  console.log("activity::reset::"+offset)
  utils.async.waterfall([
    function(callback){
      models.activity.resetActivity(resetData.authId,offset,callback)
    }
  ],function(err,removedDocs){
    console.log('removedCount::'+removedDocs.n)
    if(!err) res.send(removedDocs)
    else res.status(401)
  })
});

router.get('/:authId/:duration',function(req,res){
  console.log("GET::activity::got request "+JSON.stringify(req.body));
  var authId = req.param('authId')
  var duration = req.param('duration')
  var offset = req.param('offset')
  offset = offset?offset:0
  console.log("offset"+offset)
  utils.async.waterfall([
    function(callback){
      models.activity.findActivity(authId,duration,offset,callback)
    },function(activities,callback){
      if(activities) {
        switch (duration) {
          case "day" :
            service.activityService.fillmissingTime(service.activityService.formatActivities(activities,offset,'YYYY-MM-DDTHH:00:00'),24,"hours",offset,callback)
            break;
          case "week" :
            service.activityService.fillmissingTime(service.activityService.formatActivities(activities,offset,'YYYY-MM-DDT00:00:00'),1,"weeks",offset,callback)
            break
          case "month" :
            service.activityService.fillmissingTime(service.activityService.formatActivities(activities,offset,'YYYY-MM-DDT00:00:00'),1,"months",offset,callback)
            break
          default:
            callback(null,service.activityService.formatActivities(activities))
            break
        }
      }else callback(null,null)
    }
  ],
    function(err,activityResp){
      if(!err) {
        var highestActivity = utils._.maxBy(activityResp, function (activity) {
          if(activity.beedCount>0)
            return activity.beedCount
        })
        console.log("highestActivity::"+JSON.stringify(highestActivity,null,'  '))
        res.send({value: activityResp, highestActivity: highestActivity})
      }
      else res.status(404).send()
    }
  )
});

module.exports = router;
