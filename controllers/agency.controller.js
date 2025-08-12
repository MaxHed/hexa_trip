const { StatusCodes } = require('http-status-codes');
const Agency = require('../models/Agency');
const path = require('path');
const fs = require('fs');

//front

const getAll = async (req, res) => {
    try{
        const agencies = await Agency.find();
        return res.status(StatusCodes.OK).send(agencies);
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fecting agencies");
    }
}

//postman

const create = async (req, res) => {
    try {
        const agencies = await Agency.create(req.body);
        return res.status(StatusCodes.CREATED).send("agency created")
    }catch (error)
    {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Creation Failed");
    }
}

const getOne = async (req, res) => {
    try{
        const { id } = req.params;
        const agency = await Agency.findById(id);
        if(!agency) {
            return res.status(StatusCodes.BAD_REQUEST).send("No agency find");
        }
        return res.status(StatusCodes.OK).send(agency);

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fetching agency");
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

    let agency;
    try {
        agency = await Agency.findById(id);
        if (!agency) {
            return res.status(StatusCodes.NOT_FOUND).send("Adviser not found");
        }
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while adding image, message: " + error.message);
    }

    try {
        const uploadDir = path.join(__dirname, '..', 'public', 'images', 'agencies', id);
        const uploadPath = path.join(uploadDir, file.originalname);

        await fs.promises.mkdir(uploadDir, { recursive: true });
        await fs.promises.writeFile(uploadPath, file.buffer);
        agency.photo = file.originalname;
        await agency.save();

        return res.status(StatusCodes.CREATED).send("Image added successfully");
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while adding image, message: " + error.message);
    }
    
}
module.exports = {
    create,
    getAll,
    getOne,
    addImage
}