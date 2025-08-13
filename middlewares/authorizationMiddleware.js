const { StatusCodes } = require('http-status-codes');

const authorizeMiddleware = (accessGrantedRoles = []) => (req, res, next) => {
    if (accessGrantedRoles.length !== 0 && !accessGrantedRoles.includes(req.user.role)) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'You are not authorized to access this resource' });
    }
    next();
}

module.exports = { authorizeMiddleware };