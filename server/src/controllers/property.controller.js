const Property = require("../models/Property");
const path=require("path");
const fs=require("fs");
const User=require("../models/User")
const { response } = require("../utils/response");
// const properties = require("../data/propertiesData");

exports.getProfileImage = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user || !user.profileImagePath) {
      // fallback if no image
      const defaultImagePath = path.join(__dirname, "../public/images/dummy-avatar.png");
      return res.sendFile(defaultImagePath);
    }

    // actual stored path
    const imagePath = path.join(__dirname, "../uploads", user.profileImagePath);

    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      const defaultImagePath = path.join(__dirname, "../public/images/dummy-avatar.png");
      res.sendFile(defaultImagePath);
    }
  } catch (error) {
    console.error("Error serving profile image:", error);
    const defaultImagePath = path.join(__dirname, "../public/images/dummy-avatar.png");
    res.sendFile(defaultImagePath);
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const user = req.user;
    let filter = {};

    if (user.role === "Agent") {
      filter.createdBy = user._id;
    }

    const properties = await Property.find(filter)
      .populate("userId", "firstName lastName email role")
      .sort({ createdAt: -1 });
    response.ok(res, "Properties fetched successfully", properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    response.serverError(res, "Failed to fetch properties");
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    // Try from MongoDB first
    const property = await Property.findById(req.params.id).populate(
      "userId",
      "firstName lastName email phone role profileImagePath address"
    );

    if (!property) {
      return response.notFound(res, "Property not found");
    }
    // const propertyObj = property.toObject();
    // if (propertyObj.userId?.profileImagePath) {
    //   propertyObj.userId.profileImage = `${req.protocol}://${req.get(
    //     "host"
    //   )}/api/users/${propertyObj.userId._id}/profile-image`;
    // } else {
    //   propertyObj.userId.profileImage = `${req.protocol}://${req.get(
    //     "host"
    //   )}/public/images/dummy-avatar.png`;
    // }
    response.ok(res, "Property fetched successfully", property);
  } catch (error) {
    console.error("Error fetching property by ID:", error);
    response.serverError(res, "Failed to fetch property");
  }
};

exports.createProperty = async (req, res) => {
  try {
    const user = req.user; // comes from auth middleware

    // Only admin or agent can add property
    if (user.role !== "Admin" && user.role !== "Agent") {
      return response.forbidden(
        res,
        "Access denied: Only admin or agent can add properties"
      );
    }

    const propertyData = req.body;

    // If agent, tag property with agent info
    propertyData.userId = user._id;
    propertyData.createdBy = user._id;

    const property = await Property.create(propertyData);
    response.created(res, "Property created successfully", property);
  } catch (error) {
    console.error("Error creating property:", error);
    response.serverError(res, "Failed to create property");
  }
};

// exports.getAllProperties = async (req, res) => {
//   try {
//     const { status, type, country, state, page = 1, limit = 10 } = req.query;

//     let filter = {};
//     if (status && status !== 'any') filter.status = status;
//     if (type && type !== 'any') filter.type = type;
//     if (country && country !== 'all') filter['location.country'] = country;
//     if (state && state !== 'all') filter['location.state'] = state;

//     const properties = await Property.find(filter)
//       .populate('agent')
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .sort({ createdAt: -1 });

//     const total = await Property.countDocuments(filter);

//     response.ok(res, "Properties fetched successfully", {
//       properties,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total
//     });
//   } catch (error) {
//     response.serverError(res, "Error fetching properties");
//   }
// };

// exports.getPropertyById = async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id)
//       .populate("agent")
//       .populate("owner");

//     if (!property) {
//       return response.notFound(res, "Property not found");
//     }

//     response.ok(res, "Property fetched successfully", property);
//   } catch (error) {
//     response.serverError(res, "Error fetching property");
//   }
// };
