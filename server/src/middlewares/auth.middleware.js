const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {response}= require ("../utils/response")

/**
 * This is an asynchronous middleware function named authMiddleware that takes in request, response,
 * and next parameters.
 * @param req - The `req` parameter in the `authMiddleware` function typically represents the HTTP
 * request object, which contains information about the incoming request such as headers, parameters,
 * body, and more. This object is used to access and manipulate data related to the client's request to
 * the server.
 * @param res - The `res` parameter in the `authMiddleware` function stands for the response object. It
 * is used to send a response back to the client making the request. You can use methods on the `res`
 * object to send different types of responses such as JSON data, HTML content, status codes,
 * @param next - The `next` parameter in the `authMiddleware` function is a callback function that is
 * used to pass control to the next middleware function in the stack. When called, it will execute the
 * next middleware function. This is commonly used in Express.js middleware to move to the next
 * middleware in the chain.
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Tokens usually sent as: Authorization: Bearer <token>
    /* `const authHeader = req.headers.authorization;` is retrieving the value of the `Authorization`
    header from the incoming HTTP request. This header is commonly used to send authentication
    tokens in the format `Bearer <token>`. By extracting this header value, the code can then
    proceed to extract and verify the token for authentication purposes. */
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response.unauthorized(res, "No token, authorization denied");
    }

    /* The line `const token = authHeader.split(" ")[1];` is splitting the `authHeader` string based on
    the space character (" ") and then extracting the second element (index 1) from the resulting
    array. 
    This extracts ONLY the token part*/
    const token = authHeader.split(" ")[1];

    // ---------> Verify token

   /* The line `const decoded = jwt.verify(token, process.env.JWT_SECRET);` is responsible for
   verifying the authenticity of the JWT (JSON Web Token) extracted from the request.*/
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // -----> Attach user to request
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
