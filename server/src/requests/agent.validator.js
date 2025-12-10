const Joi = require("joi");

const addressSchema = Joi.object({
  street: Joi.string().allow("", null).optional(),
  city: Joi.string().allow("", null).optional(),
  state: Joi.string().allow("", null).optional(),
  country: Joi.string().allow("", null).optional(),
  zipCode: Joi.string().allow("", null).optional(),
}).optional();

const socialLinkField = Joi.string()
 .pattern(
    /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/i
  )
  .allow("", null)
  .optional();

exports.addAgentSchema = Joi.object({
  // User fields
  firstName: Joi.string().required(),
  lastName: Joi.string().allow("", null).optional(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(8).allow("", null).optional(),
  address: Joi.alternatives().try(Joi.string(), addressSchema).optional(),

  // Agent fields
  gender: Joi.string().valid("male", "female", "other", "", null).optional(),
  age: Joi.number().min(18).max(100).optional(),
  agency: Joi.string().allow("", null).optional(),
  agentLicense: Joi.string().allow("", null).optional(),
  taxNumber: Joi.string().allow("", null).optional(),
  serviceAreas: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .optional(),
  bio: Joi.string().max(1000).allow("", null).optional(),
  experience: Joi.alternatives()
    .try(Joi.number().min(0).max(60), Joi.string().allow("", null))
    .optional(),
  profileImage: Joi.string().allow("", null).optional(),
 
  facebook: socialLinkField,
  twitter: socialLinkField,
  instagram: socialLinkField,
  linkedin: socialLinkField,

  isActive: Joi.boolean().optional(),
});
