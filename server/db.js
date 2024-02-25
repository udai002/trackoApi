const mongoose = require("mongoose");

const connect = ()=>mongoose.connect('mongodb+srv://karumuriudaisai002:udai123@cluster0.4o0q2x6.mongodb.net/').then(()=>console.log('mongodb connected'))
.catch(err=>console.log(err))

module.exports = connect