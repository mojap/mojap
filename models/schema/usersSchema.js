var mongoose=require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
	name:String,
	userName: { type: String, required: true },
	authId: { type: String, required: true },
	email: { type: String, required: true }
})

UserSchema.index({'userName':1}, {'unique': true})
UserSchema.index({'authId':1}, {'unique': true})
UserSchema.index({'email':1}, {'unique': true})

module.exports = {
  schema: UserSchema
}