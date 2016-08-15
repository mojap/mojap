var mongoose = require('mongoose')
var ActivitySchema = require('./schema/activitySchema')

var Activity = mongoose.model('Activity', ActivitySchema.schema)
var utils = require('../utils')

function save(data,callback){
  utils.async.waterfall([
    function(callback){
      Activity.findOne({authId:data.authId,dateTime:data.dateTime}).exec(callback)
    },function(activity,callback){
      if(utils._.isUndefined(activity) || utils._.isNull(activity) || utils._.isEmpty(activity)){
        var activityObj = new Activity(data)
        activityObj.save(data,callback)
      }else{
        //utils._.extend(activity,data)
        activity.beedCount = data.beedCount
        activity.beedCountForDay = data.beedCountForDay
        console.log("activity before save::"+JSON.stringify(activity))
        activity.save(callback)
      }
    }
  ],callback)
}

function lastActivity(authId,offset,callback){
  var currentDate = utils.dateHelper.getCurrentDateWithOffset(offset)
  console.log('lastActivity::'+currentDate.format())
  Activity.findOne({authId:authId,dateTime:{$gte:new Date(currentDate)}}).sort({dateTime:-1}).limit(1).exec(callback)
}

function resetActivity(authId,offset,callback){
  var currentDate = utils.dateHelper.getCurrentDateWithOffset(offset)
  console.log('resetActivity::'+currentDate.format())
  Activity.remove({authId:authId,dateTime:{$gte:new Date(currentDate)}}).exec(callback)
}

function findActivity(authId,duration,offset,callback){
  var query = ""
  var currentDate = utils.dateHelper.getCurrentDateWithOffset(offset)

  var dateFilter = currentDate
  switch (duration){
    case "day" :
      dateFilter = currentDate
      break;
    case "week" :
      dateFilter = currentDate.add(-7,"days")
      break
    case "month" :
      dateFilter = currentDate.add(-1,"month")
      break
    default:
      dateFilter = utils.moment().utc().add(-1,"hours")
      break;
  }
  query=[
    {"$match":{authId:authId,dateTime:{$gte:new Date(dateFilter)}}},
    {"$group" : { "_id" :  "$dateTime" , beedCount : { $sum : "$beedCount" } }}
  ]
  console.log("dateFilter::"+dateFilter)
  console.log("query::"+JSON.stringify(query,null,'  '))
  Activity.aggregate(query,callback)
}

module.exports = {
  save:save,
  findActivity:findActivity,
  lastActivity:lastActivity,
  resetActivity:resetActivity
}
