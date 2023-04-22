const usersController = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { findById } = require('../models/User')

//update
usersController.put('/:id', async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAmin){
        if(req.body.password){
            try {
            req.body.password = await bcrypt.hash(req.body.password, 10)
                
            } catch (err) {
                 res.status(500).json(err.message)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json('Account has been updated')
        } catch (err) {
            res.status(500).json(err.message)
        }
    }else {
        return res.status(403).json('You can change only your account!')
    }
})
 
//delete
usersController.delete('/:id', async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAmin){
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json('Account has been deleted')
        } catch (err) {
            res.status(500).json(err.message)
        }
    }else {
        return res.status(403).json('You can delete only your account!')
    }
})
//get user
usersController.get('/:id', async(req, res) => {
        try {
            const user = await User.findById(req.params.id)
            const {password, updatedAt, ...others} = user._doc
            res.status(200).json(others)
        } catch (err) {
            res.status(500).json(err.message)
    }
})
//follow user
usersController.put('/:id/follow', async(req, res) => {
    if(req.body.userId !== req.params.id){       
            try {
            const user  = await User.findById(req.params.id)
            const currentUser  = await User.findById(req.body.userId)
              if(!user.followers.includes(req.body.userId)){
               await user.updateOne({$push: {followers: req.body.userId}})
               await currentUser.updateOne({$push: {followins: req.body.userId}})
               res.status(200).json('user has been followed')
              }else{
                res.status(403).json('you allready follow this user')
              } 
            } catch (err) {
                 res.status(500).json(err.message)
            }    
    }else {
        return res.status(403).json('You can follow yourself')
    }
})

//unfollowing
usersController.put('/:id/unfollow', async(req, res) => {
    if(req.body.userId !== req.params.id){       
            try {
            const user  = await User.findById(req.params.id)
            const currentUser  = await User.findById(req.body.userId)
              if(user.followers.includes(req.body.userId)){
               await user.updateOne({$pull: {followers: req.body.userId}})
               await currentUser.updateOne({$pull: {followins: req.body.userId}})
               res.status(200).json('user has been unfollowed')
              }else{
                res.status(403).json('you dont follow this user')
              } 
            } catch (err) {
                 res.status(500).json(err.message)
            }    
    }else {
        return res.status(403).json('You can unfollow yourself')
    }
})


module.exports = usersController