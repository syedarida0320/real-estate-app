const User = require("../models/User");
const { response } = require("../utils/response");
const path = require("path");
const fs = require("fs");
//const Review = require("../models/Review");

///  Utility: build profile image URL dynamically
const buildProfileImageUrl = (req, userId) => {
  return `${req.protocol}://${req.get(
    "host"
  )}/api/users/${userId}/profile-image`;
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const usersWithImageUrls = users.map((u) => {
      const obj = u.toObject(); //  converts Mongoose document → plain JavaScript object
      if (obj.profileImagePath) {
        obj.profileImage = buildProfileImageUrl(req, obj._id);
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
    const user = new User(req.body); // parsed JSON payload sent from frontend.
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
    if (
      req.user._id.toString() !== req.params.id &&
      req.user.role !== "Admin" // .toString() → convert ObjectId to string for comparison.
    ) {
      return response.forbidden(res, "Access denied");
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) return response.notFound(res, "User not found");

    const userObj = user.toObject();
    if (userObj.profileImagePath) {
      userObj.profileImage = buildProfileImageUrl(req, userObj._id);
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
    if (
      req.user._id.toString() !== req.params.id &&
      req.user.role !== "Admin"
    ) {
      return response.forbidden(res, "You can only update your own profile");
    }

    // existing user to possibly remove old image
    const existing = await User.findById(req.params.id);
    if (!existing) return response.notFound(res, "User not found");

    const allowedFields = ["email", "address", "phone"];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] != undefined) {
        updateData[field] = req.body[field];
      }
    });

    //  handle profile image -> if file uploaded, attach profileImagePath and delete old file if present
    if (req.file) {
      // remove old image if exists
      if (existing.profileImagePath) {
        const oldPath = path.join(
          process.cwd(),
          "private/images",
          existing.profileImagePath
        );
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (e) {
            console.warn("Failed to remove old profile image", e.message);
          }
        }
      }

      updateData.profileImagePath = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true, // ensures mongoose schema validation
      }
    ).select("-password");

    // add computed profileImage URL for response if file exists

    if (!updatedUser) return response.notFound(res, "User not found");

    const userObj = updatedUser.toObject();
    if (userObj.profileImagePath) {
      userObj.profileImage = buildProfileImageUrl(req, userObj._id);
    }
    response.ok(res, "User updated successfully", userObj);
  } catch (err) {
    if (err.name === "ValidationError") {
      const fieldErrors = {};
      for (let field in err.errors) {
        fieldErrors[field] = err.errors[field].message;
      }
      return response.validationError(res, "Validation failed", fieldErrors);
    }
    response.badRequest(res, err.message);
  }
};

// ✅ Serve profile image securely
const getProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user._id.toString() === req.user._id.toString() || req.user.role === 'Admin') {
      let imagePath;
      if (user && user.profileImagePath) {
        imagePath = path.join(
          process.cwd(),
          "private/images",
          user.profileImagePath
        );
        if (!fs.existsSync(imagePath)) {
          imagePath = path.join(process.cwd(), "public/images/dummy-avatar.png");
        }
      } else {
        imagePath = path.join(process.cwd(), "public/images/dummy-avatar.png");
      }
      return res.sendFile(imagePath);
    }
  } catch (error) {
    response.serverError(res, error.message);
    return response.forbidden(res, "Un-authorized access");
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  getProfileImage,
};
