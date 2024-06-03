const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ErrorHandler } = require('../helpers/error');

// Register
const register = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        next(new ErrorHandler(400, error.message));
    }
}


// Login
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User
        if (!user) {
            throw new ErrorHandler(401, 'Invalid credentials');
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        next(new ErrorHandler(401, error.message));
    }
};

module.exports = { register, login };