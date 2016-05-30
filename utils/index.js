var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var log = require('./log')
var uuid = require('./uuidHelper')
function fromMoment(dateMoment) {
  return ObjectId.createFromTime(dateMoment.toDate().getTime()/1000);
}

var config ={
	mongoUrl:"mongodb://localhost:27017/mojap"
}

module.exports = {
  toObjectID: ObjectId,
  ObjectID: ObjectId,
  fromMoment: fromMoment,
  config:config,
  log:log,
  uuid:uuid
};