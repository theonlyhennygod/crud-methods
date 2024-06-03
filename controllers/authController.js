const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const { ErrorHandler } = require('../helpers/error');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

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


// Send verification email
const sendVerificationEmail = async (user) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const url = `http://yourdomain.com/verify-email?token=${token}`;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        to: user.email,
        subject: 'Verify your email',
        text: `Click this link to verify your email: ${url}`
    };
    await transporter.sendMail(mailOptions);
};

// Verify email
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new ErrorHandler(400, 'Invalid token');
        }
        user.isVerified = true;
        await user.save();
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        next(error);
    }
};


// const register = [
//     check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
//     check('password').isStrongPassword().withMessage('Password must be strong'),
//     async (req, res, next) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         // Continue with registration logic
//     }
// ];


// Login
const login = async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
        await user.incLoginAttempts();
        if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
            user.lockUntil = Date.now() + LOCK_TIME;
            await user.save();
            return res.status(429).json({ message: 'Too many login attempts, account locked' });
        }
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    // Reset login attempts on successful login
    user.loginAttempts = 0;
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
};

// Send reset password email
const sendResetEmail = async (user) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const url = `http://yourdomain.com/reset-password?token=${token}`;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        to: user.email,
        subject: 'Password Reset',
        text: `Click this link to reset your password: ${url}`
    };
    await transporter.sendMail(mailOptions);
};

// Reset password
const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new ErrorHandler(400, 'Invalid token');
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        next(error);
    }
};

// Refresh token
const refreshToken = async (req, res, next) => {
    try {
        const { token } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token: newToken });
    } catch (error) {
        next(new ErrorHandler(400, 'Invalid refresh token'));
    }
};

// Role-based access control
const roleMiddleware = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

module.exports = { register, login, sendVerificationEmail, verifyEmail, sendResetEmail, resetPassword, refreshToken, roleMiddleware};