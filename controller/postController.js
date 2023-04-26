const postController = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')

//create
postController.post('/', async(req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (err) {
        res.status(500).json(err.message)
    }
})

//update
postController.put('/:id', async(req, res) => {
    try { 
        const post = await Post.findById(req.params.id)
            if(post.userId === req.body.userId){
              await post.updateOne({$set:req.body})
                res.status(200).json("post has been update")
            } else {
            res.status(403).json("you can update only your post")
        }
} catch (err) {
        res.status(500).json(err.message)
    }
})
//delete
postController.delete('/:id', async(req, res) => {
    try { 
        const post = await Post.findById(req.params.id)
            if(post.userId === req.body.userId){
              await post.deleteOne()
                res.status(200).json("post has been deleted")
            } else {
            res.status(403).json("you can delete only your post")
        }
} catch (err) {
        res.status(500).json(err.message)
    }
})
//like
postController.put('/:id/like', async(req, res) => {
    try { 
        const post = await Post.findById(req.params.id)

            if(!post.likes.includes(req.body.userId)){
              await post.updateOne({$push:{likes: req.body.userId}})
                res.status(200).json("post has been likes")
            } else {
                await post.updateOne({$pull:{likes: req.body.userId}})
                res.status(200).json("post has been dislikes")
                 }
} catch (err) {
        res.status(500).json(err.message)
    }
})
//get a post
postController.get('/:id', async(req, res) => {
   
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json(err.message)
    }
})

//get timeline posts
postController.get('/timeline/:userId', async(req, res) => { 
    try {
        const currentUser = await User.findById(req.params.userId)
        const userPosts = await Post.find({userId: currentUser._id})
        const friendPosts = await Promise.all(
        currentUser.followins.map((friendId) => {
            Post.find({ userId: friendId})
        })
        
        );console.log(friendPosts)
        res.status(200).json(userPosts.concat(...friendPosts))
    } catch (err) {
        res.status(500).json(err.message)
    }
})

//get user's all posts
postController.get("/profile/:username", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      console.log(user)
      const posts = await Post.find({ userId: user._id });
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });
   


module.exports = postController