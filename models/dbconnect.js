var mongoose = require('mongoose');
var utils = require('../utils')

var connect = function(){
	mongoose.connect(utils.config.mongoUrl, { server: { socketOptions: { keepAlive: 1 } } });//'mongodb://localhost:27017/nodejs'	
}

connect()

var mongoConnection = mongoose.connection;

mongoConnection.once('open', function callback() {
  utils.log.info('Successfully connected to Mongo DB');
});

// Error handler
mongoConnection.on('error', function (err) {
  utils.log.sever('Error from Database' + err)
});

// Reconnect when closed
mongoConnection.on('disconnected', function () {
  connect();
});


module.exports = {
	mongoose: mongoose,
	utils:utils
}