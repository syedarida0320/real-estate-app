const { response } = require("../utils/response");

module.exports = function adminMiddleware(req, res, next) {
  if (req.user?.role !== "Admin") {
    return response.forbidden(res, "Access denied. Admins only.");
  }
  next();
};
