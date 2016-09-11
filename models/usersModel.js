var mongoose = require('mongoose')
var UserSchema = require('./schema/usersSchema')

var User = mongoose.model('User', UserSchema.schema)
var utils = require('../utils')
function saveUser(data,callback){
	var user = new User(data)
	user.save(function(err,user,numAffects){
		return callback(err,user)
	})
}

function findUser(query,callback){
	User.findOne(query)
			.select("-passWord")
			.exec(function(err,user){
				return callback(err,user)
			})
}

function updateUser(query,data,callback){
	User.update(query,data,{upsert:true}).exec(callback)
}
function addDevice(data,callback){
	console.log("addDevice"+JSON.stringify(data,null,"  "))
	utils.async.waterfall([
		function(callback){
			findUser({authId:data.authId},callback)
		},function(user,callback){
			if(utils._.isNull(user) || utils._.isUndefined(user))
				return callback({error:"User not found"},null)
			else{
				updateUser({authId:data.authId},{token:data.token,type:data.type},callback)
			}
		}
	],callback)
}

module.exports = {
	saveUser:saveUser,
	findUser:findUser,
	addDevice:addDevice
}