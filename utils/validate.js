const Joi = require('joi');

/**
 * Middleware to validate request data against a Joi schema.
 * @param {Object} schema - The Joi schema to validate against.
 * @param {string} property - The request property to validate (body, query, params).
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ error: 'Validation Error', messages: errors });
    }

    next();
  };
};

module.exports = validate;