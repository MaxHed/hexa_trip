const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { authenticationMiddleware } = require('../middlewares/authenticationMiddleware');


// user routes
router.get('/', authenticationMiddleware, profileController.getProfile);
router.patch('/:id', authenticationMiddleware, profileController.updateProfile);
router.delete('/:id', authenticationMiddleware, profileController.deleteProfile);

module.exports = router;