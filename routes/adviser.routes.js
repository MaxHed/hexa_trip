const express = require('express');
const router = express.Router();
const adviserController = require('../controllers/adviser.controller');
const singleFileUploaderMiddleware = require('../middlewares/simpleUploader');

// endpoints front
// TODO: add a middleware to check if the user is authenticated

router.get('/', adviserController.getAll)

router.get('/:id', adviserController.getOne)

// endpoints postman
router.post('/', adviserController.create)
router.post('/:id', singleFileUploaderMiddleware, adviserController.addImage)




module.exports = router;