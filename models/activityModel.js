var mongoose = require('mongoose')
var ActivitySchema = require('./schema/activitySchema')

var Activity = mongoose.model('Activity', ActivitySchema.schema)

function save(data,callback){
  var activity = new Activity(data)
  activity.save(data,callback)
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
  findActivity:findActivity
}
