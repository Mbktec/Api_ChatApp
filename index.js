const express = require('express')
const { default: mongoose } = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const usersController = require('./controller/usersController')
const authController = require('./controller/authController')
const postController = require('./controller/postController')
const app = express()
dotenv.config()

mongoose
    .connect(`${process.env.MONGO_URL}`)
    .then(()=> console.log('La base a été bien connecter'))
    .catch(err => console.log(err))


//middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())


app.use('/moi', (req, res) => {
    res.send("heloo")
})

app.use('/api/users', usersController)
app.use('/api/auth', authController)
app.use('/api/posts', postController)

app.listen(process.env.PORT, ( )=> {
    console.log("le serveur est en cours")
}) 