const Joi = require("joi");

// Nested schemas
const priceSchema = Joi.object({
  amount: Joi.number().required(),
  duration: Joi.string().allow(null, ""),
  currency: Joi.string().default("USD"),
});

const facilitiesSchema = Joi.object({
  beds: Joi.number().default(0),
  baths: Joi.number().default(0),
  area: Joi.string().allow("", null),
  smokingArea: Joi.boolean().default(false),
  kitchen: Joi.boolean().default(false),
  balcony: Joi.boolean().default(false),
  wifi: Joi.boolean().default(false),
  parkingArea: Joi.boolean().default(false),
});

const locationSchema = Joi.object({
  address: Joi.string().allow("", null),
  city: Joi.string().allow("", null),
  state: Joi.string().allow("", null),
  country: Joi.string().allow("", null),
  postalCode: Joi.string().allow("", null), 
  mapLocation: Joi.object({
    lat: Joi.number(),
    lng: Joi.number(),
    alt: Joi.number().optional(),
  }).optional(),
});

const createPropertySchema = Joi.object({
  title: Joi.string().required(),
  type: Joi.string()
    .valid("Apartment", "Hotel", "House", "Commercial", "Garages", "Lots")
    .required(),
  status: Joi.string().valid("available", "sold", "rented").optional(),
  availabilityType: Joi.string().valid("for_rent", "for_sale", "sold").required(),
  price: priceSchema.required(),
  location: locationSchema.optional(),
  facilities: facilitiesSchema.optional(),
  description: Joi.string().allow("", null),
});

const updatePropertySchema = Joi.object({
  title: Joi.string().optional(),
  type: Joi.string()
    .valid("Apartment", "Hotel", "House", "Commercial", "Garages", "Lots")
    .required(),
  status: Joi.string().valid("available", "sold", "rented").optional(),
  availabilityType: Joi.string().valid("for_rent", "for_sale", "sold").required(),
  price: priceSchema.optional(),
  location: locationSchema.optional(),
  facilities: facilitiesSchema.optional(),
  description: Joi.string().allow("", null).optional(),
});

const validate = (schema) => (req, res, next) => {
  const data = { ...req.body };

  // If price, location, or facilities are sent as JSON string → parse them
  ["price", "location", "facilities"].forEach((field) => {
    if (req.body[field] && typeof req.body[field] === "string") {
      try {
       /* The line `data[field] = JSON.parse(req.body[field]);` is parsing the JSON string stored in
       the `req.body[field]` into a JavaScript object and assigning it to the corresponding field in
       the `data` object. */
        data[field] = JSON.parse(req.body[field]);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a valid JSON object`,
        });
      }
    }
  });

  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    console.log("Validation error details:", error.details);
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ success: false, errors: messages });
  }
  req.body = data;
  next();
};

module.exports = {
  createPropertySchema,
  updatePropertySchema,
  validate,
};
