const Joi = require("joi");

// Schema for updating user profile
const updateProfileSchema = Joi.object({
  address: Joi.alternatives().try(
    Joi.string().allow("", null),
    Joi.object({
      street: Joi.string().allow("", null),
      city: Joi.string().allow("", null),
      state: Joi.string().allow("", null),
      country: Joi.string().allow("", null),
      zipCode: Joi.string().allow("", null),
    })
  ).optional(),
  phone: Joi.string()
    .pattern(/^\d{10,15}$/)
    .message("Phone number must be 10-15 digits")
    .allow("", null)
    .optional(),
});

module.exports = { updateProfileSchema };
