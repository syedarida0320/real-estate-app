const User = require("../models/User");
const { response } = require("../utils/response");
const path = require("path");
const fs = require("fs");
const Agent = require("../models/Agent");
const Message = require("../models/Message");
// const Conversation = require("../models/Conversation");

//  Utility: build profile image URL dynamically
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

    const allowedFields = ["address", "phone"];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] != undefined) {
        updateData[field] = req.body[field];
      }
    });

    // ✅ Block email changes even if someone tries manually
    if (req.body.email && req.body.email !== existing.email) {
      return response.forbidden(
        res,
        "Changing email is not allowed for security reasons"
      );
    }

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

    // if (
    //   user._id.toString() === req.user._id.toString() ||
    //   req.user.role === "Admin"
    // )

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
  } catch (error) {
    response.serverError(res, error.message);
    return response.forbidden(res, "Un-authorized access");
  }
};

const getUserMessages = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id;
    if (!loggedInUserId) {
      return response.unauthorized(res, "Authentication required");
    }

    const { search } = req.query;
    const hasSearch = search && search.trim().length > 0;

    let users = [];
    let messagesByPartner = {};

    // If getting search query param then return all users which match the search query
    console.log("req.query", req.query, "hasSearch", hasSearch);
    if (hasSearch) {
      const searchRegex = new RegExp(`.*${search.trim()}.*`, "i"); // Case-insensitive partial match
      console.log("searchRegex", searchRegex);
      users = await User.find({
        role: { $in: ["Agent", "Admin"] },
        _id: { $ne: loggedInUserId },
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
        ],
      })
        .select(
          "firstName lastName email role profileImagePath emailVerifiedAt"
        )
        .sort({ createdAt: -1 });

      console.log("users", users);

      if (users.length > 0) {
        const userIds = users.map((u) => u._id);
        const messageFilter = {
          $or: [
            { sender: loggedInUserId, receiver: { $in: userIds } },
            { receiver: loggedInUserId, sender: { $in: userIds } },
          ],
        };
        const allMessages = await Message.find(messageFilter)
          .sort({ createdAt: -1 })
          .lean();

        allMessages.forEach((msg) => {
          const partnerId =
            msg.sender.toString() === loggedInUserId.toString()
              ? msg.receiver
              : msg.sender;
          if (!messagesByPartner[partnerId]) {
            messagesByPartner[partnerId] = msg;
          }
        });
      }
    } else {
      // by Default we just have to return only the users which are in the conversation
      const messageFilter = {
        $or: [{ sender: loggedInUserId }, { receiver: loggedInUserId }],
      };
      const allMessages = await Message.find(messageFilter)
        .sort({ createdAt: -1 })
        .lean();

      const partnerIds = new Set();
      allMessages.forEach((msg) => {
        const partnerId =
          msg.sender.toString() === loggedInUserId.toString()
            ? msg.receiver
            : msg.sender;
        if (partnerId.toString() !== loggedInUserId.toString()) {
          partnerIds.add(partnerId.toString());
        }
      });

      if (partnerIds.size === 0) {
        return response.ok(res, "Users fetched successfully", []);
      }

      users = await User.find({
        _id: { $in: Array.from(partnerIds) },
        isActive: true,
        role: { $in: ["Agent", "Admin"] },
      })
        .select(
          "firstName lastName email role profileImagePath emailVerifiedAt"
        )
        .sort({ createdAt: -1 });

      allMessages.forEach((msg) => {
        const partnerId =
          msg.sender.toString() === loggedInUserId.toString()
            ? msg.receiver
            : msg.sender;
        if (!messagesByPartner[partnerId]) {
          messagesByPartner[partnerId] = msg;
        }
      });
    }

    // Prepare final user list with correct profile images
    const formattedUsers = await Promise.all(
      users.map(async (user) => {
        let profileImage = `${req.protocol}://${req.get("host")}/api/users/${
          user._id
        }/profile-image`; // default admin/user image

        // If Agent → get profile image from Agent table
        if (user.role === "Agent") {
          const agent = await Agent.findOne({ user: user._id }).lean();
          if (agent && agent.profileImage) {
            profileImage = `${req.protocol}://${req.get("host")}/api/users/${
              user._id
            }/profile-image`;
          }
        }

        return {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          profileImage,
          lastMessage: messagesByPartner[user._id.toString()] || null,
        };
      })
    );

    return response.ok(res, "Users fetched successfully", formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    response.serverError(res, "Failed to fetch users");
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  getProfileImage,
  getUserMessages,
};
