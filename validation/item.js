const Joi = require('joi');

const itemSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    quantity: Joi.number().required(),
});

module.exports = itemSchema;