const mongoose = require('mongoose')

const corrierSchema = mongoose.Schema({
    trackingId : String ,
    senderAddress:String , 
    receiverAddress:String,
    Status:{
        default:"yet to Dispatch",
        type:String 
    },
    date:{
        type:Date,
        default:Date.now()
    },
    updates:[]
})

module.exports = mongoose.model('Corrier' , corrierSchema)