const Brand = require("../models/brandModel");
const asynchHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");


// !@Function:    create a Brand
// !@Method:      POST
// !@Route:       /api/Brand
const createBrand = asynchHandler(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
    } catch (error) {
        throw new Error(error);
    }
})

// !@Function:    update a Brand
// !@Method:      PUT
// !@Route:       /api/Brand/:id
const updateBrand = asynchHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedBrand);
    } catch (error) {
        throw new Error(error);
    }
});

// !@Function:    delete a Brand
// !@Method:      DELETE
// !@Route:       /api/Brand/:id
const deleteBrand = asynchHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deletedBrand = await Brand.findByIdAndDelete(id);
        res.json(deletedBrand);
    } catch (error) {
        throw new Error(error);
    }
});

// !@Function:    get a Brand
// !@Method:      GET
// !@Route:       /api/Brand/:id
const getBrand = asynchHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const getaBrand = await Brand.findById(id);
        res.json(getaBrand);
    } catch (error) {
        throw new Error(error);
    }
});

// !@Function:    get all Brand
// !@Method:      GET
// !@Route:       /api/Brand/
const getAllBrand = asynchHandler(async (req, res) => {

    try {
        const getAllBrand = await Brand.find();
        res.json(getAllBrand);
    } catch (error) {
        throw new Error(error);
    }
});
module.exports = { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand };