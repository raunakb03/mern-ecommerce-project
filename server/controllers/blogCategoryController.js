const Category = require("../models/blogCategoryModel");
const asynchHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");


// !@Function:    create a category
// !@Method:      POST
// !@Route:       /api/category
const createCategory = asynchHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch (error) {
        throw new Error(error);
    }
})

// !@Function:    update a category
// !@Method:      PUT
// !@Route:       /api/category/:id
const updateCategory = asynchHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedCategory);
    } catch (error) {
        throw new Error(error);
    }
});

// !@Function:    delete a category
// !@Method:      DELETE
// !@Route:       /api/category/:id
const deleteCategory = asynchHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.json(deletedCategory);
    } catch (error) {
        throw new Error(error);
    }
});

// !@Function:    get a category
// !@Method:      GET
// !@Route:       /api/category/:id
const getCategory = asynchHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const getaCategory = await Category.findById(id);
        res.json(getaCategory);
    } catch (error) {
        throw new Error(error);
    }
});

// !@Function:    get all category
// !@Method:      GET
// !@Route:       /api/category/
const getAllCategory = asynchHandler(async (req, res) => {

    try {
        const getAllCategory = await Category.find();
        res.json(getAllCategory);
    } catch (error) {
        throw new Error(error);
    }
});
module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getAllCategory };