const { response } = require("../utils/response");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    // Collect all validation errors
    const errors = {};
    error.details.forEach((detail) => {
      const field = detail.context.key;
      if (!errors[field]) errors[field] = [];
      errors[field].push(detail.message);
    });

    return response.validationError(res, "Validation failed", errors);
  }

  next();
};

module.exports = validate;
