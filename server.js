require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dbConfig = require('./config/db');
const rateLimit = require('express-rate-limit');
const itemRoutes = require('./routes/route');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const mongoSanitize = require('express-mongo-sanitize');
const { handleError } = require('./utils/errorHandler');

const app = express();
const port = process.env.PORT || 3004;

// Conncet to MongoDB
mongoose.connect(dbConfig.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    logger.info('Connected to MongoDB');
}).catch((err) => {
    logger.error(`Error connecting to MongoDB: ${err}`);
});

// Close MongoDB connection when the app is closed

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Swagger
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Inventory API',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:3004',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

// Initialize swagger-jsdoc
const specs = swaggerJsDoc(options);

// Serve Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Data sanitization
app.use(mongoSanitize());

// Error handling
app.use((err, req, res, next) => {
    handleError(err, res);
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('common', { stream: { write: message => logger.info(message.trim()) }}));

// Compression
app.use(compression());

// Rate limiting
app.use('/api/', limiter);

// Routes
app.use('/api/items', itemRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});