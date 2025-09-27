const User = require("../models/User");
//const Review = require("../models/Review");
const { response } = require("../utils/response");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
    response.ok(res, "Users fetched successfully", usersWithReviews);
  } catch (error) {
    response.serverError(res, error.message);
  }
};

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    response.created(res, "User created successfully", user);
  } catch (error) {
    response.badRequest(res, error.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return response.notFound(res, "User not found");
    response.ok(res, "User fetched successfully", user);
  } catch (error) {
    response.serverError(res, error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    if (!updatedUser) return response.notFound(res, "User not found");
    response.ok(res, "User updated successfully", updatedUser);
  } catch (err) {
   response.badRequest(res, err.message);
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
};
