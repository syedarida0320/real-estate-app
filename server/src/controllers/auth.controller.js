const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("../utils/response");
const { sendEmail } = require("../utils/email"); // ✅ import email util

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
   if (existingUser) {
      return response.badRequest(res, "Validation failed", {
        email: ["Email already registered"],
      });
}

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      ...(phone && { phone }),
    });

    await user.save();

    // generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Send Welcome Email (Job)
     await sendEmail(user.email, "Welcome to Real Estate App 🎉", "welcome", {
      firstName: user.firstName,
      lastName: user.lastName,
    });

    response.created(res, "User registered successfully", {
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    response.serverError(res, error.message);
  }
};

//  LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return response.badRequest(res, "Validation failed", {
        email: ["Email not found"],
      });
    }


    // check password
    const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
      return response.badRequest(res, "Validation failed", {
        password: ["Incorrect password"],
      });
    }

    // generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    response.ok(res, "Login successful", {
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    response.serverError(res, error.message);
  }
};

module.exports = { loginUser, registerUser };
