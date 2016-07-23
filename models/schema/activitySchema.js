var mongoose=require('mongoose')
var Schema = mongoose.Schema

var ActivitySchema = new Schema({
  authId: { type: String, required: true },
  dateTime: { type: Date, required: true },
  prayerKey: { type: String, required: true, default:"prayer" },
  beedCount: {type:Number,required:true, default:0},
  beedCountForDay: {type:Number,required:true, default:0}
})

ActivitySchema.index({authId:1,dateTime:2})

module.exports = {
  schema: ActivitySchema
}
