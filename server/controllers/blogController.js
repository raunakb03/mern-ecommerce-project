const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asynchHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const { response } = require("express");


// !@Function:    create a blog
// !@Method:      POST
// !@Route:       /api/blog
const createBlog = asynchHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error);
    }
})

// !@Function:    update a blog
// !@Method:      PUT
// !@Route:       /api/blog/:id
const updateBlog = asynchHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateBlog);
    } catch (error) {
        throw new Error(error);
    }
})

// !@Function:    get a blog
// !@Method:      GET
// !@Route:       /api/blog/:id
const getBlog = asynchHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getBlog = await Blog.findById(id);
        let views = getBlog.numViews;
        views++;
        await Blog.findByIdAndUpdate(id, { numViews: views }, { new: true });
        res.json(getBlog);
    } catch (error) {
        throw new Error(error);
    }

});

// !@Function:    get all blogs
// !@Method:      GET
// !@Route:       /api/blog
const getAllBlogs = asynchHandler(async (req, res) => {
    try {
        const getBlogs = await Blog.find();
        res.json(getBlogs);
    } catch (error) {
        throw new Error(error);
    }
});

// !@Function:    delete blog
// !@Method:      DELETE
// !@Route:       /api/blog/:id
const deleteBlog = asynchHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id);
        if (!deleteBlog) return res.json({ msg: "Blog does not exists" });
        res.json(deleteBlog);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog };
