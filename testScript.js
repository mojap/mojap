
var express = require('express')
var utils = require('./utils')
var models = require('./models')
var command = process.argv[2]

switch(command) {
  case "momentTest":
    var currentDate = utils.moment().utc()
    console.log('currentDate'+currentDate.format())
    var currentDateTillHr = new utils.moment({year:currentDate.year(),month:currentDate.month(),day:currentDate.date(),hour:currentDate.hours(),minute:0,seconds:0})
    console.log('currentDateTillHr'+currentDateTillHr.format())
    break;
  default:
    break;
}
