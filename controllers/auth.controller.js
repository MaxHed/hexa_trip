const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).send("Username, email and password are required");
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).send("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        return res.status(StatusCodes.CREATED).send("User created successfully");
    }catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while registering user");
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).send("Email and password are required");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).send("User not found");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(StatusCodes.BAD_REQUEST).send("Invalid password");
        }
        
        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email
        }, jwtSecret, { expiresIn: "24h" });

        const { password: _, __V, ...userWithoutPassword } = user._doc;
        return res.status(StatusCodes.OK).json({ token, user: userWithoutPassword });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while logging in, message: " + error.message);
    }
}

module.exports = { register, login };