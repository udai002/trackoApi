const mongoose  = require('mongoose')
const { Schema } = mongoose;

const Employee =  new Schema({
    user_id:{
        type:String,
        default:Date.now()
    },
    name:String,
    mobile_no:Number,
    designation:String,
    gender:String,
    image:String,
    course:String,
    email:String

})

module.exports = mongoose.model('Employee' , Employee)
