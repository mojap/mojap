
var express = require('express')
var utils = require('./utils')
var models = require('./models')
var command = process.argv[2]
var service = require('./service')
switch(command) {
  case "momentTest":
    var currentDate = utils.moment().utc()
    console.log('currentDate'+currentDate.format())
    var currentDateTillHr = new utils.moment({year:currentDate.year(),month:currentDate.month(),day:currentDate.date(),hour:currentDate.hours(),minute:0,seconds:0})
    console.log('currentDateTillHr'+currentDateTillHr.format())

    var momentStr = utils.moment.utc("2016-07-23 15:00:00").format()
    console.log(momentStr)

    var momentHr = utils.moment.utc().format("YYYY-MM-DDTHH:00:00Z")
    console.log("momentHr"+momentHr)
    break;
  case "durationTest":
    var dateFilter = utils.moment().utc().add(-24,"hours")
    switch (process.argv[3]){
      case "day" :
        break;
      case "week" :
        dateFilter = utils.moment().utc().add(-7,"days")
        break
      case "month" :
        dateFilter = utils.moment().utc().add(-1,"month")
        break
      default:
        dateFilter = utils.moment().utc().add(-1,"hours")
        break
    }
    console.log("today::"+utils.moment().utc().format())
    console.log("dateFilter::"+dateFilter.format())
    break;
  case "activityTest":
    var activityJson = require('./testfiles/activities.json')
    var activityFinalList = service.activityService.formatActivities(activityJson.value)
    console.log("activityFinalList::\n"+JSON.stringify(activityFinalList,null,"  "))

    var hrFilledList = service.activityService.fillmissingTime(activityFinalList,24,"hours",function(err,actRespList){
      console.log("########finalSortList::\n"+JSON.stringify(actRespList,null,"  "))
    })

    var activityDayJson = require('./testfiles/activitiesDay.json')
    var activityDayList = service.activityService.formatActivities(activityDayJson.value)
    service.activityService.fillmissingTime(activityDayList,1,"weeks",function(err, actRespList){
      console.log("########finalDaySortList::\n"+JSON.stringify(actRespList,null,"  "))
    })

    service.activityService.fillmissingTime(activityDayList,1,"months",function(err,actRespList){
      console.log("########finalMonthSortList::\n"+JSON.stringify(actRespList,null,"  "))
    })

  default:
    break;
}
