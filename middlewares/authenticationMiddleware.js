const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');

const authenticationMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'You must be logged in to access this resource' });
        }

        const jwtSecret = process.env.JWT_SECRET;
        const token = authHeader.split(' ')[1];
        const userByToken = jwt.verify(token, jwtSecret);
        const userDB = await User.findById(userByToken.id).select('-password -__v -updatedAt');

        req.user = userDB;
        next();

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error while authenticating user' });
    }
}

module.exports = { authenticationMiddleware };

