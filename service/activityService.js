var utils = require('../utils')
var momentTz = require('moment-timezone')
function fillmissingHours(activities,totalHours, callback){
  var currentDateTime = utils.moment().utc()
  var startDateTime =  utils.moment().utc().add(-totalHours,"hours")
  while(startDateTime <= currentDateTime){
    var key = startDateTime.format("YYYY-MM-DDTHH:00:00Z")
    if(!utils._.find(activities,{dateTime:key})){
      activities.push({dateTime:key,beedCount:0})
    }
    startDateTime = startDateTime.add(1,"hours")
  }
  return callback(null,activities)
}

function fillmissingTime(activities,totalDuration,durationType,offset, callback){
  console.log("fillmissingTime::activities"+JSON.stringify(activities,null,"  "))
  var endDateTime = durationType == "hours"?utils.dateHelper.getCurrentDateWithOffsetLocal(offset).add("1","days"):utils.dateHelper.getCurrentDateWithOffsetLocal(offset)
  var startDateTime =  durationType == "hours"?utils.dateHelper.getCurrentDateWithOffsetLocal(offset):utils.dateHelper.getCurrentDateWithOffsetLocal(offset).add(-totalDuration,durationType)
  console.log("startDateTime::"+startDateTime.format())
  console.log("endDateTime::"+endDateTime.format())
  var dateFormat = durationType == "hours"? "YYYY-MM-DDTHH:00:00":"YYYY-MM-DDT00:00:00"
  var interval =  durationType == "hours"? "hours":"days"
  while(startDateTime < endDateTime){
    var key = startDateTime.format(dateFormat)
    console.log("fillmissingTime::key::"+key)
    if(!utils._.find(activities,{dateTime:key})){
      activities.push({dateTime:key,beedCount:0})
    }
    startDateTime = startDateTime.add(1,interval)
  }

  var finalSortList = utils._.sortBy(activities,function(activity){
    return activity.dateTime
  })
  console.log("finalSortList::"+JSON.stringify(finalSortList,null,"  "))
  return callback(null,finalSortList)
}

function formatActivities(activities,offset,dateFormat){
  console.log("formatActivities::activities"+JSON.stringify(activities,null,"  "))
  var activityList = []
    utils._.map(activities,function(activity){
      console.log("formatActivities::activity"+JSON.stringify(activity,null,"  "))
      var activityResp = {
        dateTime:momentTz(utils.moment(activity._id)).tz(offset).format(dateFormat),
        beedCount:activity.beedCount
      }
      activityList.push(activityResp)
    })

  var activityRespList = []
  utils._.map(activityList,function(activity){
    var activityResp = utils._.find(activityRespList,{dateTime:activity.dateTime})
    if(activityResp)
      activityResp.beedCount = activityResp.beedCount+activity.beedCount
    else {
      activityRespList.push(activity)
    }
  })

  console.log("activityRespList::"+JSON.stringify(activityRespList,null,"  "))
  return activityRespList
}

function formatTimeZone(activities,timeOffset, callback){
  utils._.map(activities,function(activity){
    activity.dateTime=utils.moment(activity.dateTime).utc().add(timeOffset,'hours').format('YYYY-MM-DDTHH:00:00')
  })

  //console.log("activityRespList::"+JSON.stringify(activityRespList,null,"  "))
  return callback(null,activities)
}

module.exports = {
  fillmissingHours:fillmissingHours,
  formatActivities:formatActivities,
  fillmissingTime:fillmissingTime,
  formatTimeZone:formatTimeZone
}