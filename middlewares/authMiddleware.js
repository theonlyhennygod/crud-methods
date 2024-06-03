const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../helpers/error');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return next(new ErrorHandler(401, 'Access Denied'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        next(new ErrorHandler(401, 'Invalid Token'));
    }
}

module.exports = authMiddleware;