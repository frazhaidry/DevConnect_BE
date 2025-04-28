const express = require('express');
const BlogRouter = express.Router();
const Blog = require('../models/Blog');
const { userAuth } = require('../middlewares/auth');
const BlogModel = require('../models/Blog');


// GET all blogs 
BlogRouter.get("/blogs", async(req, res) => {
    try{
        const blogs = await Blog.find({});
        res.json({
            message: "Blogs fetched successfully",
            data: blogs,
        })
    }
    catch(error){
        res.status(400).send("ERROR: " + error.message);
    }
})

// GET a single blog by ID
BlogRouter.get("/blogs/:id", async(req, res) => {
    const {id} = req.params
    try{
        const blog = await Blog.findById(id).populate("author", "firstName lastName photoUrl");
        if(!blog){
            return res.status(404).send("Blog not found")

        }
        res.json({
            message: "Blog fetched successfully",
            data: blog,
        })

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

BlogRouter.put("/blogs/:id", userAuth, async(req , res) => {
    const {title, content, tags} = req.body
    const {id} = req.params;
    try{
        const blog = await Blog.findById(id);
        if(!blog){
            return res.status(404).send("Blog not found")
        }
        if(blog.author.toString() !== req.user._id.toString()){
            return res.status(401
            ).send("You are not allowed to edit this blog")
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.tags = tags || blog.tags;

        const updated = await blog.save();

        res.json({
            message: "Blog updated successfully",
            data: updated,
        })

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }

})

// POST a new blog
BlogRouter.post("/blogs", userAuth, async(req, res) => {
    const {title, content, tags} = req.body;
    try{
        const newBlog = new Blog({
            title,
            content,
            tags,
            author: req.user._id
        })
        await newBlog.save();
        res.json({
            message: "Blog created successfully",
            data: newBlog,
        })
    }catch(error){
        res.status(400).send("ERROR: " + error.message);
    }
})

// Delete Blog
BlogRouter.delete("/blogs/:id", userAuth, async(req, res) => {
    const {id} = req.params;

    try{
        const blog = await Blog.findById(id);

        if(!blog){
            return res.status(400).send("Blog not found")
        }

        if(blog.author.toString() !== req.user._id.toString()){
            return res.status(404).send("You are not allowed to delete this blog")
        }

        await blog.deleteOne({ _id: blog._id });

        res.json({
            message: "Blog deleted successfully",
            data: blog,
        })
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})



module.exports = BlogRouter