const { response } = require("../utils/response");

const isAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return response.forbidden(res, "Access forbidden: Admins only");
  }
  next();
};

module.exports = { isAdmin };
