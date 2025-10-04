const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');

const postValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];

// create post (protected)
router.post('/', auth, postValidation, async(req, res) => {
    try{
        const { title, content } = req.body;
        const post = new Post({ title, content, author: req.user.userId });

        await post.save();
        res.status(201).json(post);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Read all posts
router.get('/', async (req, res) => {
    try{
        const posts = (await Post.find().populate('author', 'name email')).toSorted({ createdAt: -1 });

        res.json(posts);
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server '});
    }
});

// Read single post by ID
router.get('/:id', async(req, res) => {
    try{
        const post = await Post.findById(req.params.id).populate('author', 'name email');
        
        if(!post){
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Update post (protected, only author)
router.put('/:id', auth, postValidation, async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({ message: 'Post not found '});
        if(post.author.toString() !== req.user.userId){
            return res.status(403).json({ message: 'Not authoried to update this post' });
        }

        post.title = req.body.title;
        post.content = req.body.content;
        await post.save();

        res.json(post);
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error '});
    }
});


router.delete('/:id', auth, async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ message: 'Post not found' });
        }
        if(post.author.toString() !== req.user.userId){
            return res.status(403).json({ message: 'Not authorized to delete this post '});
        }

        await post.remove();
        res.json({ message: 'Post deleted successfully '});
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error '});
    }
});


module.exports = router;




