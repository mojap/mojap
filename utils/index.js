var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var log = require('./log')
var uuid = require('./uuidHelper')
var lodash = require('lodash');
var dateHelper = require('./dateHelper')
function fromMoment(dateMoment) {
  return ObjectId.createFromTime(dateMoment.toDate().getTime()/1000);
}

var config ={
	mongoUrl:process.env.MONGOLAB_URI || "mongodb://localhost:27017/mojap"
}

module.exports = {
  toObjectID: ObjectId,
  ObjectID: ObjectId,
  fromMoment: fromMoment,
  _: lodash,
  config:config,
  log:log,
  async: require('async'),
  moment: require('moment'),
  uuid:uuid,
  dateHelper:dateHelper
};