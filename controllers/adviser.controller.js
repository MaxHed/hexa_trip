const { StatusCodes } = require('http-status-codes');
const Adviser = require('../models/Adviser'); 
const path = require('path');
const fs = require('fs');

// endpoints frontend

const getAll = async (req, res) => {
    try {
        const params = req.query;
        let formattedParams = {};
        if (params.town) {
            formattedParams.tags = { $regex: params.town, $options: 'i' };
        }
        const advisers = await Adviser.find(formattedParams);
        return res.status(StatusCodes.OK).send(advisers);
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fetching advisers, message: " + error.message);
    }
}

const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const adviser = await Adviser.findById(id);
        if (!adviser) {
            return res.status(StatusCodes.NOT_FOUND).send("Adviser not found");
        }
        return res.status(StatusCodes.OK).send(adviser);
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fetching adviser, message: " + error.message);
    }
}



// endpoints postman

const create = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(StatusCodes.BAD_REQUEST).send("Name is required");
        }
        await Adviser.create(req.body);
        return res.status(StatusCodes.CREATED).send("Adviser created successfully");
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while creating adviser, message: " + error.message);
    }
}

const addImage = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).send("Adviser ID is required");
    }

    // Vérifie que le fichier est bien présent
    if (!req.file) {
        return res.status(StatusCodes.BAD_REQUEST).send("Image is required");
    }
    const file = req.file;

    let adviser;
    try {
        adviser = await Adviser.findById(id);
        if (!adviser) {
            return res.status(StatusCodes.NOT_FOUND).send("Adviser not found");
        }
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while adding image, message: " + error.message);
    }

    try {
        const uploadDir = path.join(__dirname, '..', 'public', 'images', 'advisers', id);
        const uploadPath = path.join(uploadDir, file.originalname);

        await fs.promises.mkdir(uploadDir, { recursive: true });
        await fs.promises.writeFile(uploadPath, file.buffer);

        adviser.image = file.originalname;
        await adviser.save();

        return res.status(StatusCodes.CREATED).send("Image added successfully");
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while adding image, message: " + error.message);
    }
    
}



module.exports = { getAll, getOne, create, addImage};