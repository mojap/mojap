var mongoose = require('mongoose')
var UserSchema = require('./schema/usersSchema')

var User = mongoose.model('User', UserSchema.schema)

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

module.exports = {
	saveUser:saveUser,
	findUser:findUser
}