const authController = require('express').Router()
const User = require('../models/User')
const brcrypt = require('bcrypt')

//register
authController.post('/register', async (req, res) => {
try {
    const hashPassword = await brcrypt.hash(req.body.password, 10)
    const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword
    })
    const user = await newUser.save();
    res.status(200).json(user) 
} catch (err) {
    res.status(500).json(err.message)
}
})
 
///login
authController.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({email:req.body.email});
        !user && res.status(404).json('user not found')
        const validPass = await brcrypt.compare(req.body.password, user.password)
        !validPass && res.status(400).json('password not found')

        res.status(200).json(user)
    } catch (err) {
    res.status(500).json(err.message)
        
    }
})

module.exports = authController