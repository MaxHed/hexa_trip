const { StatusCodes } = require('http-status-codes');
const Order = require('../models/Order'); 

// endpoints

const getAll = async (req, res) => {
    try {
        const { email } = req.query;
        const orders = await Order.find({ email }).populate('trip');
        return res.status(StatusCodes.OK).send(orders);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fetching orders, message: " + error.message);
    }
}

module.exports = { getAll };