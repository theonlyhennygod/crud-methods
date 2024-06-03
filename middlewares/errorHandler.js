// module.exports = (error, request, response, next) => {
//     const statusCode = response.statusCode === 200 ? 500 : response.statusCode;
//     response.status(statusCode);
//     response.json({
//         message: error.message,
//         stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
//     });
// };

class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

const handleError = (err, res) => {
    const { statusCode, message } = err;
    res.status(statusCode).json({
        status: "error",
        statusCode,
        message
    });
}

module.exports = {
    ErrorHandler,
    handleError
};