const Joi = require('joi');

const schema = Joi.object({
  id: Joi.number().integer().required(),
  entry: Joi.string().required(),
});

module.exports = schema;