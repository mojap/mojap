var moment = require('moment')
var momentTz = require('moment-timezone')

function getCurrentDateWithOffsetV0(offset){

  var currentDateWithOffset = moment().utc().add(offset,"hours")
  console.log("currentDateWithOffset::"+currentDateWithOffset.format())
  var currentDate = new moment({
    year: currentDateWithOffset.year(),
    month: currentDateWithOffset.month(),
    day: currentDateWithOffset.date(),
    hour: 0,
    minute: 0,
    seconds: 0
  }).utc()

  return currentDate
}

function getCurrentDateWithOffset(offset){
  var currentDateWithOffset = momentTz(moment.utc()).tz(offset)
  console.log("currentDateWithOffset::"+currentDateWithOffset.format())
  var currentDate = new moment({
    year: currentDateWithOffset.year(),
    month: currentDateWithOffset.month(),
    day: currentDateWithOffset.date(),
    hour: 0,
    minute: 0,
    seconds: 0
  }).utc()
  console.log("currentDate::"+currentDate.format())
  return currentDate
}

function getCurrentDateWithOffsetLocal(offset){
  var currentDateWithOffset = momentTz(moment.utc()).tz(offset)
  console.log("getCurrentDateWithOffsetLocal::"+currentDateWithOffset.format())
  var currentDate = new moment({
    year: currentDateWithOffset.year(),
    month: currentDateWithOffset.month(),
    day: currentDateWithOffset.date(),
    hour: 0,
    minute: 0,
    seconds: 0
  })
  console.log("currentDate::"+currentDate.format())
  return currentDate
}

module.exports = {
  getCurrentDateWithOffset:getCurrentDateWithOffset,
  getCurrentDateWithOffsetLocal:getCurrentDateWithOffsetLocal
}