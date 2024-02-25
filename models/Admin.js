const mongoose  = require('mongoose')
const { Schema } = mongoose;

const AdminSchema =  new Schema({
    username:String,
    password:String,
    email:String

})

module.exports = mongoose.model('Admin' , AdminSchema)
