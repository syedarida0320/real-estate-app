// request/agentRequest.validation.js
const Joi = require("joi");

// Schema for agent request
const agentRequestSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  age: Joi.number().integer().min(18).max(100).required(),
  city: Joi.string().min(2).max(50).required(),
  state: Joi.string().min(2).max(50).required(),
  country: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must contain 10-15 digits only",
    }),
});

// Middleware for validation
const validateAgentRequest = (req, res, next) => {
  const { error } = agentRequestSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((detail) => detail.message).join(", ");
    return res.status(400).json({ success: false, message: messages });
  }
  next();
};

module.exports = validateAgentRequest;
