var utils = require('../utils')

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

function fillmissingTime(activities,totalDuration,durationType, callback){
  var currentDateTime = utils.moment().utc()
  var startDateTime =  utils.moment().utc().add(-totalDuration,durationType)
  var dateFormat = durationType == "hours"? "YYYY-MM-DDTHH:00:00Z":"YYYY-MM-DDT00:00:00Z"
  var interval =  durationType == "hours"? "hours":"days"
  while(startDateTime <= currentDateTime){
    var key = startDateTime.format(dateFormat)
    if(!utils._.find(activities,{dateTime:key})){
      activities.push({dateTime:key,beedCount:0})
    }
    startDateTime = startDateTime.add(1,interval)
  }

  var finalSortList = utils._.sortBy(activities,function(activity){
    return activity.dateTime
  })

  return callback(null,finalSortList)
}

function formatActivities(activities){
  var activityRespList = []
    utils._.map(activities,function(activity){
      var activityResp = {
        dateTime:utils.moment.utc(activity._id).format(),
        beedCount:activity.beedCount
      }
      activityRespList.push(activityResp)
    })

  //console.log("activityRespList::"+JSON.stringify(activityRespList,null,"  "))
  return activityRespList
}

module.exports = {
  fillmissingHours:fillmissingHours,
  formatActivities:formatActivities,
  fillmissingTime:fillmissingTime
}