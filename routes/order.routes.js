const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticationMiddleware } = require('../middlewares/authenticationMiddleware');
const { authorizeMiddleware } = require('../middlewares/authorizationMiddleware');

// endpoints
// TODO: add a middleware to check if the user is authenticated

router.get('/', authenticationMiddleware, authorizeMiddleware(['admin', 'user']), orderController.getAll)


module.exports = router;