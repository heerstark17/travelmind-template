const mongoose = require("mongoose")

const ChatSchema = new mongoose.Schema({

userId:String,
query:Object,
response:Object,

date:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("ChatHistory",ChatSchema)