var mongoose = require('mongoose')
var ActivitySchema = require('./schema/activitySchema')

var Activity = mongoose.model('Activity', ActivitySchema.schema)
var utils = require('../utils')
mongoose.set('debug','true')
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
  switch (duration){
    case "day" :
      query={dateTime:{$gt:new Date(Date.now() - 24*60*60 * 1000)}}
      break;
    case "week" :
      query={dateTime:{$gt:new Date(Date.now() - 24*60*60 * 1000*7)}}
      break
    default:
      query={dateTime:{$gt:new Date(Date.now() - 60*60 * 1000)}}
      break
  }

  Activity.find(query)
    .exec(callback)
}

module.exports = {
  save:save,
  findActivity:findActivity,
  lastActivity:lastActivity
}
