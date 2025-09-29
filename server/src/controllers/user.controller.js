const User = require("../models/User");
const { response } = require("../utils/response");
const path = require("path");
const fs = require("fs");
//const Review = require("../models/Review");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const host = `${req.protocol}://${req.get("host")}`;

    const usersWithImageUrls = users.map((u) => {
      // u.toObject() converts Mongoose document → plain JavaScript object
      const obj = u.toObject();
      if (obj.profileImagePath) {
        obj.profileImage = `${host}/api/users/${obj._id}/profile-image`;
      }
      return obj;
    });

    response.ok(res, "Users fetched successfully", usersWithImageUrls);
  } catch (error) {
    response.serverError(res, error.message);
  }
};

const createUser = async (req, res) => {
  try {
    // req.body → parsed JSON payload sent from frontend.
    const user = new User(req.body);
    await user.save();
    response.created(res, "User created successfully", user);
  } catch (error) {
    response.badRequest(res, error.message);
  }
};

// ✅ Get user by ID (self only, unless admin)
const getUserById = async (req, res) => {
  try {
    // allow only the user themself or admin
    // .toString() → convert ObjectId to string for comparison.
    if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
      return response.forbidden(res, "Access denied");
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) return response.notFound(res, "User not found");

    const host = `${req.protocol}://${req.get("host")}`;
    const userObj = user.toObject();
    if (userObj.profileImagePath) {
      userObj.profileImage = `${host}/api/users/${userObj._id}/profile-image`;
    }

    response.ok(res, "User fetched successfully", userObj);
  } catch (error) {
    response.serverError(res, error.message);
  }
};


// ✅ Update user profile (with image)
const updateUser = async (req, res) => {
  try {
    // only allow user to update own profile (admin allowed)
    if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
      return response.forbidden(res, "You can only update your own profile");
    }

    // existing user to possibly remove old image
    const existing = await User.findById(req.params.id);
    if (!existing) return response.notFound(res, "User not found");
    const updateData = { ...req.body };

    // if file uploaded, attach profileImagePath and delete old file if present
    if (req.file) {
      // delete old file (optional)
      if (existing.profileImagePath) {
        const oldPath = path.join(__dirname, "..", "private", "images", existing.profileImagePath);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) { console.warn("Failed to remove old profile image", e.message); }
        }
      }

      updateData.profileImagePath = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).select("-password");

    // add computed profileImage URL for response if file exists
    const host = `${req.protocol}://${req.get("host")}`;
    const userObj = updatedUser.toObject();
    if (userObj.profileImagePath) {
      userObj.profileImage = `${host}/api/users/${userObj._id}/profile-image`;
    }

    response.ok(res, "User updated successfully", userObj);
  } catch (err) {
    response.badRequest(res, err.message);
  }
};



// ✅ Serve profile image securely
const getProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

   let imagePath;
    if (user && user.profileImagePath) {
      imagePath = path.join(process.cwd(), "private/images", user.profileImagePath);
      if (!fs.existsSync(imagePath)) {
        // fallback to default
        imagePath = path.join(process.cwd(), "public/images/dummy-avatar.png");
      }
    } else {
      // fallback to default
      imagePath = path.join(process.cwd(), "public/images/dummy-avatar.png");
    }

    return res.sendFile(imagePath);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching image", error: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  getProfileImage
};
