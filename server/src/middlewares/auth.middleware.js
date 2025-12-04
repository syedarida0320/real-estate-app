const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {response}= require ("../utils/response")

const authMiddleware = async (req, res, next) => {
  try {
    // Tokens usually sent as: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response.unauthorized(res, "No token, authorization denied");
    }

    /* The line `const token = authHeader.split(" ")[1];` is splitting the `authHeader` string based on
    the space character (" ") and then extracting the second element (index 1) from the resulting
    array. */
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    // check how select work in monogodb
    // Study mongoose ORM. Also read ORM in general
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

module.exports = {authMiddleware};
