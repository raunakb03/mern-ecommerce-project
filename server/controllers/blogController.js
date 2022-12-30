const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asynchHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createBlog = asynchHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error);
    }
})

const updateBlog = asynchHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateBlog);
    } catch (error) {
        throw new Error(error);
    }
})
module.exports = { createBlog, updateBlog };
