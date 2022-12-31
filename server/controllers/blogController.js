const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asynchHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");


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
    validateMongodbId(id);
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
    validateMongodbId(id);
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
    validateMongodbId(id);
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id);
        if (!deleteBlog) return res.json({ msg: "Blog does not exists" });
        res.json(deleteBlog);
    } catch (error) {
        throw new Error(error);
    }
});

// !@Function:    like blog
// !@Method:      PUT
// !@Route:       /api/blog/:id
const likeBlog = asynchHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongodbId(blogId);
    //find the blog that you want to like
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isLiked = blog?.isLiked;
    // find if the user had disliked the blog
    const alreadyDisliked = blog?.dislikes?.find((userId) => userId?.toString() === loginUserId?.toString());
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false
        }, { new: true });
        res.json(blog);
    }
    else if (isLiked) {
        console.log(2);
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        }, { new: true });
        res.json(blog);
    } else {
        console.log(3);
        const blog = await Blog.findByIdAndUpdate(
            blogId, {
            $push: { likes: loginUserId },
            isLiked: true
        }, { new: true });
        res.json(blog);
    }
})

module.exports = { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog };
