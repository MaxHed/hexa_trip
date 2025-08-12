const { StatusCodes } = require('http-status-codes');
const Trip = require('../models/Trip');
const { categoryCodes } = require('../helpers/data');
const path = require('path');
const fs = require('fs');

// front
const getAll = async (req, res) => {
    const params = req.query;
    let formattedParams = {};
    if (params.region && params.region !== "0") {
        formattedParams.region = parseInt(params.region);
    }
    // duration
    if (params.duration && params.duration !== "0") {
        formattedParams.duration = parseInt(params.duration);
    }
    // town
    if (params.town && params.town !== "0") {
        formattedParams.town = { $regex: params.town, $options: 'i' };
    }
    // price
    if (params.price && params.price !== "0") {
        formattedParams.adultPrice = { $lte: parseInt(params.price) };
        formattedParams.childPrice = { $lte: parseInt(params.price) };
    }
    // category
    if (params.category && params.category !== "0") {
        const category = categoryCodes.find(cat => cat.code === params.category);
        if (category) {
            formattedParams.category = category.name;
        }
    }
    if (params.tags && params.tags !== "0") {
        const tag = tags.find(tag => tag.code === parseInt(params.tags));
        if (tag) {
            formattedParams.tags = tag.name;
        }
    }

    try {
        const trips = await Trip.find(formattedParams);
        return res.status(StatusCodes.OK).send(trips)
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fetching trips");
    }
}

const getAllBestsellers = async (req, res) => {
    const trips = await Trip.find({ tags: "bestseller" });
    if (!trips) {
        return res.status(StatusCodes.NOT_FOUND).send("No bestsellers found");
    }
    try {
        return res.status(StatusCodes.OK).send(trips);
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fetching bestsellers");
    }
}

// postman

const create = async (req, res) => {
    const { title } = req.body
    if (!title) {
        return res.status(StatusCodes.BAD_REQUEST).send("Title is required");
    }
    try {
        const trip = await Trip.create(req.body);
        return res.status(StatusCodes.CREATED).json({
            message: "Trip created successfully",
            trip
        })
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while creating trip");
    }
}

const getOne = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).send("Trip ID is required");
    }
    try {
        const trip = await Trip.findById(id);
        if (!trip) {
            return res.status(StatusCodes.NOT_FOUND).send("Trip not found");
        }
        return res.status(StatusCodes.OK).send(trip);
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fetching trip");
    }
}

const patchOne = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).send("Trip ID is required");
    }
    try {
        const trip = await Trip.findByIdAndUpdate(id, req.body, { new: true });
        if (!trip) {
            return res.status(StatusCodes.NOT_FOUND).send("Trip not found");
        }
        return res.status(StatusCodes.OK).send(trip);
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while patching trip");
    }
}

const deleteOne = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).send("Trip ID is required");
    }
    try {
        const trip = await Trip.findByIdAndDelete(id);
        if (!trip) {
            return res.status(StatusCodes.NOT_FOUND).send("Nothing to delete");
        }
        return res.status(StatusCodes.OK).send("Trip deleted successfully");
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while deleting trip");
    }
}

const deleteAll = async (req, res) => {
    try {
        const result = await Trip.deleteMany();
        if (result.deletedCount === 0) {
            return res.status(StatusCodes.NOT_FOUND).send("Nothing to delete");
        }
        return res.status(StatusCodes.OK).send("All trips deleted successfully");
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while deleting all trips");
    }
}

const addImages = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).send("Trip ID is required");
    }

    const files = req.files;
    if (!files || files.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).send("Images are required");
    }

    let trip;
    try {
        trip = await Trip.findById(id);
        if (!trip) {
            return res.status(StatusCodes.NOT_FOUND).send("Trip not found");
        }
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while adding images");
    }

    if (Object.keys(trip).length === 0) {
        return res.status(StatusCodes.NOT_FOUND).send("Trip not found");
    }

    try {
        await Promise.all(
            files.map(async (file) => {
                const uploadPath = path.join(__dirname, '..', 'public', 'images', 'trips', id, file.originalname);
                const directory = path.dirname(uploadPath);
                await fs.promises.mkdir(directory, { recursive: true });
                await fs.promises.writeFile(uploadPath, file.buffer);
                trip.images.push(file.originalname);
            })
        );
        await trip.save();
        return res.status(StatusCodes.CREATED).send("Images added successfully");
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while adding images");
    }

}

module.exports = { create, getAll, getOne, getAllBestsellers, patchOne, deleteOne, deleteAll, addImages };