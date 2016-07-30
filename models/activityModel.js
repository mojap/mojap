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

function lastActivity(authId,callback){
  Activity.findOne({authId:authId}).sort({dateTime:-1}).limit(1).exec(callback)
}

function findActivity(authId,duration,callback){
  var query = ""
  var dateFilter = utils.moment().utc().add(-24,"hours")
  switch (duration){
    case "day" :
      dateFilter = utils.moment().utc().add(-24,"hours")
      query=[
        {"$match":{authId:authId,dateTime:{$gt:new Date(dateFilter)}}},
        {"$group" : { "_id" :  { $dateToString: { format: "%Y-%m-%d %H:00:00", date: "$dateTime" }} , beedCount : { $sum : "$beedCount" } }}
      ]
      break;
    case "week" :
      dateFilter = utils.moment().utc().add(-7,"days")
      query=[
        {"$match":{authId:authId,dateTime:{$gt:new Date(dateFilter)}}},
        {"$group" : { "_id" :  { $dateToString: { format: "%Y-%m-%d 00:00:00", date: "$dateTime" }} , beedCount : { $sum : "$beedCount" } }}
      ]
      break
    case "month" :
      dateFilter = utils.moment().utc().add(-1,"month")
      query=[
        {"$match":{authId:authId,dateTime:{$gt:new Date(dateFilter)}}},
        {"$group" : { "_id" :  { $dateToString: { format: "%Y-%m-%d 00:00:00", date: "$dateTime" }} , beedCount : { $sum : "$beedCount" } }}
      ]
      break
    default:
      dateFilter = utils.moment().utc().add(-1,"hours")
      query=[
        {"$match":{authId:authId,dateTime:{$gt:new Date(dateFilter)}}},
        {"$group" : { "_id" :  { $dateToString: { format: "%Y-%m-%d %H:00:00", date: "$dateTime" }} , beedCount : { $sum : "$beedCount" } }}
      ]
      break;
  }
  console.log("dateFilter::"+dateFilter)
  console.log("query::"+JSON.stringify(query,null,'  '))
  Activity.aggregate(query,callback)
}

module.exports = {
  save:save,
  findActivity:findActivity,
  lastActivity:lastActivity
}
