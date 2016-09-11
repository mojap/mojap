var mongoose=require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
	//name:String,
	//userName: { type: String, required: true },
	authId: { type: String, required: true },
	//password: { type: String, required: true },
	phoneNo: { type: String, required: true },
	token:String,
	type:String
})

//UserSchema.index({'userName':1}, {'unique': true})
UserSchema.index({'authId':1}, {'unique': true})
UserSchema.index({'phoneNo':1}, {'unique': true})

module.exports = {
  schema: UserSchema
}