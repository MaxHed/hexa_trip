const { body, validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const validateRegister = [
    body("username")
        .isAlphanumeric()
        .withMessage("Username must be alphanumeric")
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters"),
    body("email")
        .isEmail()
        .withMessage("Invalid email")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
        }
        next();
    }
]

module.exports = validateRegister;