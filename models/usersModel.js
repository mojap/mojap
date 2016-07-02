var mongoose = require('mongoose')
var UserSchema = require('./schema/usersSchema')

var User = mongoose.model('User', UserSchema.schema)

function save(data,callback){
	var user = new User(data)
	user.save(data,callback)
}

function findUser(query,callback){
	User.findOne(JSON.stringify(query))
			.select("-passWord")
			.exec(callback)
}

module.exports = {
	save:save,
	findUser:findUser
}