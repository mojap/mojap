var mongoose = require('mongoose')
var UserSchema = require('./schema/usersSchema')

var User = mongoose.model('User', UserSchema.schema)

function saveUser(data,callback){
	var user = new User(data)
	user.save(function(err,data){
		if(err) return callback(err,null)
		else return callback(null,data)
	})
}

function findUser(query,callback){
	User.findOne(query)
			.select("-passWord")
			.exec(callback)
}

function updateUser(query,data,callback){
	User.update(query,data,{upsert:true}).exec(callback)
}

module.exports = {
	saveUser:saveUser,
	findUser:findUser
}