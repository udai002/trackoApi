const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
const port = dotenv.parsed.PORT || 3000

const Admin = require('./models/Admin')
const { default: mongoose } = require('mongoose')
const corrier = require('./models/corrier')

app.use(express.json())

console.log(port)
mongoose
    .connect('mongodb+srv://karumuriudaisai002:udai123@cluster0.4o0q2x6.mongodb.net/')
    .then(() => console.log('db connected'))
    .catch(err => console.log(err))





app.post('/addData', async (req, res) => {

    const { title, senderAddress, receiverAddress, } = req.body
    const uniqueId = Date.now()

    try {
        const createdData = await corrier.create({
            trackingId: uniqueId,
            title,
            senderAddress,
            receiverAddress
        })

        if (createdData) {
            res.status(200).send(createdData)
        }
    } catch (err) {
        res.status(500).send({ err })
    }

})


//get the corrier data
app.get('/getData', async (req, res) => {
    const data = await corrier.find().then(data => {
        return res.status(200).send(data)
    }).catch(err => {
        return res.status(500).send({ err })
    })

})

//Get data by tracking id
app.get('/getData/:id', async (req, res) => {
    try {
        const { id } = req.params
        const data = await corrier.findOne({ trackingId: id })
        res.send(data)
    } catch (e) {
        return res.status(500).send({ err: "Some error Occurred" })
    }

})

// to update data 
app.post('/updateData/:id', async (req, res) => {
    const { id } = req.params
    const { location, Address } = req.body
    const timeStamp = Date.now()
    const locationData = { location, Address, time: timeStamp }
    try {
        const prevData = await corrier.findOne({ trackingId: id })
        const UpdateArray = prevData.updates
        const data = await corrier.updateOne({ trackingId: id }, { $set: { updates: [...UpdateArray, locationData] } })
        res.send(data)
    } catch (e) {
        res.status(500).send({ err: "Some Error Occured" })
    }


})


// to delete data 
app.delete('/deleteData/:id', async (req, res) => {
    const { id } = req.params
    await corrier.deleteOne({ trackingId: id }).then(() => {
        return res.send("Deleted successfully")
    }).catch(err => {
        res.send({ err })
    })
})


// to login Admin
app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const userData = await Admin.findOne({ username })
    try{
        if (userData) {
            if (userData.password === password) {
                const jwtToken = jwt.sign({ username }, 'JWT_SECRET')
    
                return res.status(200).send({ jwtToken })
            }
        } else {
            return res.status(400).send({ err: "Invalid credentials" })
        }
    }catch(e){
        return res.status(500).send({error:e , errMsg:'Some Error Ocurred'})
    }
    
})


// to signup admin
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body
    //checking wheather the user already exist
    const user = await Admin.findOne({ username })
    if (!user) {
        await Admin.create({
            username, email, password
        }).then(() => {
            const jwtToken = jwt.sign({
                username,
                email
            }, 'JWT_SECRET')

            console.log(jwtToken)

            return res.send({ jwtToken })
        }).catch(err => {
            return res.send(err)
        })
    } else {
        return res.send("user already exists")
    }

}
)


app.listen(port, () => {
    console.log('http://localhost:5000')
})


module.exports = app