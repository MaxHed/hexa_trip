const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

// endpoints
// TODO: add a middleware to check if the user is authenticated

router.get('/', orderController.getAll)


module.exports = router;