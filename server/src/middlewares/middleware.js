const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {response}= require ("../utils/response")

const auth = async (req, res, next) => {
  try {
    // Tokens usually sent as: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response.unauthorized(res, "No token, authorization denied");
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.userId).select("-password");

   if (!req.user) {
      return response.unauthorized(res, "User not found, authorization denied");
    }

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
     return response.unauthorized(res, "Token is not valid");
  }
};

module.exports = auth;
