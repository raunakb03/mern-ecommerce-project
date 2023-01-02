const Category = require("../models/productCategoryModel");
const asynchHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");


// !@Function:    create a category
// !@Method:      POST
// !@Route:       /api/category
const createCategory = asynchHandler(async (req, res) => {
    try {
        const newCategory= await Category.create(req.body);
        res.json(newCategory);
    } catch (error) {
        throw new Error(error);
    }
})

// !@Function:    update a category
// !@Method:      PUT
// !@Route:       /api/category/:id
const updateCategory = asynchHandler(async (req, res) =>{
    const {id}= req.params;
    try {
        const updatedCategory= await Category.findByIdAndUpdate(id, req.body, {new: true});
        res.json(updatedCategory);
    } catch (error) {
        throw new Error(error);
    }
});
module.exports = {createCategory, updateCategory};