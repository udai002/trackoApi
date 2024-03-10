const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cors = require('cors')
const dotenv = require('dotenv').config()
const port = dotenv.parsed.PORT || 3000

const Admin = require('./models/Admin')
const { default: mongoose } = require('mongoose')
const corrier = require('./models/corrier')
const Employee = require('./models/Employee')

app.use(express.json())
app.use(cors())

console.log(port)
mongoose
    .connect('mongodb+srv://karumuriudaisai002:udai123@cluster0.4o0q2x6.mongodb.net/')
    .then(() => console.log('db connected'))
    .catch(err => console.log(err))



// to get the employee data 
app.get('/api/users' , async (req , res)=>{
    try{
        const users = await Employee.find()
        res.status(200).send(users)
    }catch(e){
        res.send(500).send({msg:"Something went wrong" , err :e})
    }
     
})

// to update the employee data 
app.post('/api/user_update/:id', async (req,res)=>{
    const {name , mobileNo ,  email , designation , gender , course  } = req.body 
    const {id} = req.params
    await Employee.findOneAndUpdate({user_id:id}, {
        name , mobile_no:mobileNo , email , designation , gender , course
    }).then(()=>{
        res.status(200).send({msg:"Successfully updated" , status:true})
    }).catch(e=>{
        res.status(500).send({msg:"something went wrong" , err:e , status:false})
    })
})


// to create a employee data 
app.post('/api/create_employee' , async (req , res)=>{
    const {name , mobileNo ,  email , designation , gender , course  } = req.body 
    await Employee.create({name , mobile_no:mobileNo , email  , designation , gender ,course }).then(()=>{
        res.status(200).send({msg:"users successfully created"})
    }).catch(e=>{
        res.status(500).send({msg:"something went wrong " , err:e})
    })

})

// to login Admin
app.post('/api/login', async (req, res) => {
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
app.post('/api/signup', async (req, res) => {
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