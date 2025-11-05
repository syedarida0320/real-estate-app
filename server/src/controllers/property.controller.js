const Property = require("../models/Property");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const { response } = require("../utils/response");

exports.getAllProperties = async (req, res) => {
  try {
    const user = req.user;
    let filter = {};

    if (user && user.role === "Agent") {
      filter.createdBy = user._id;
    }
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }

    const { status, type, country, state, search } = req.query;

    if (status && status !== "any") {
      filter.$or = [{ status: status }, { availabilityType: status }];
    }

    if (type && type !== "any") {
      filter.type = type;
    }

    if (country && country !== "all") {
      filter["location.country"] = country;
    }

    if (state && state !== "all") {
      filter["location.state"] = state;
    }

    // 🔍 Text search (title or city or address)
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { "location.city": searchRegex },
        { "location.address": searchRegex },
      ];
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalProperties = await Property.countDocuments(filter);

    const properties = await Property.find(filter)
      .populate(
        "userId",
        "firstName lastName email role phone profileImagePath address"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    response.ok(res, "Properties fetched successfully", {
      properties,
      currentPage: page,
      totalPages: Math.ceil(totalProperties / limit),
      totalItems: totalProperties,
    });
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

    const { price, location, facilities, availabilityType, ...rest } = req.body;
    const propertyData = {
      ...rest,
      availabilityType,
      price: price ? JSON.parse(price) : {},
      location: location ? JSON.parse(location) : {},
      facilities: facilities ? JSON.parse(facilities) : {},
      userId: user._id,
      createdBy: user._id,
    };

    // Handle uploaded files
    propertyData.mainImage = req.files?.mainImage?.[0]
      ? `uploads/${req.files.mainImage[0].filename}`
      : undefined;

    propertyData.galleryImages = req.files?.galleryImages
      ? req.files.galleryImages.map((file) => `uploads/${file.filename}`)
      : [];

    const property = await Property.create(propertyData);
    response.created(res, "Property created successfully", property);
  } catch (error) {
    console.error("Error creating property:", error);
    response.serverError(res, "Failed to create property");
  }
};
exports.updateProperty = async (req, res) => {
  try {
    // Parse nested objects
    const { price, location, facilities, availabilityType, ...rest } = req.body;
    const updateData = {
      ...rest,
      availabilityType,
      price: price ? JSON.parse(price) : undefined,
      location: location ? JSON.parse(location) : undefined,
      facilities: facilities ? JSON.parse(facilities) : undefined,
    };

    // Handle uploaded files
    // Main Image
    if (req.files?.mainImage?.[0]) {
      updateData.mainImage = `uploads/${req.files.mainImage[0].filename}`;
    } else if (req.body.mainImageUrl) {
      updateData.mainImage = req.body.mainImageUrl; // keep existing main image
    }

    // Gallery Images
    let newGalleryImages = [];
    if (req.files?.galleryImages) {
      newGalleryImages = req.files.galleryImages.map(
        (file) => `uploads/${file.filename}`
      );
    }

    // Include existing gallery images from frontend
    const existingGalleryImages = req.body.existingGalleryImages
      ? Array.isArray(req.body.existingGalleryImages)
        ? req.body.existingGalleryImages
        : [req.body.existingGalleryImages]
      : [];

    updateData.galleryImages = [...existingGalleryImages, ...newGalleryImages];

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!property) {
      return response.notFound(res, "Property not found");
    }
    response.ok(res, "Property updated successfully", property);
  } catch (error) {
    console.error("Error updating property:", error);
    response.serverError(res, "Error updating property");
  }
};

exports.getProfileImage = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user || !user.profileImagePath) {
      const defaultImagePath = path.join(
        __dirname,
        "../public/images/dummy-avatar.png"
      );
      return res.sendFile(defaultImagePath);
    }

    const imagePath = path.join(__dirname, "../uploads", user.profileImagePath);

    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      const defaultImagePath = path.join(
        __dirname,
        "../public/images/dummy-avatar.png"
      );
      res.sendFile(defaultImagePath);
    }
  } catch (error) {
    console.error("Error serving profile image:", error);
    const defaultImagePath = path.join(
      __dirname,
      "../public/images/dummy-avatar.png"
    );
    res.sendFile(defaultImagePath);
  }
};

// Get all unique countries from properties
exports.getUniqueCountries = async (req, res) => {
  try {
    const user = req.user;
    let filter = { "location.country": { $ne: null } };

    // If user is Agent → only get their own property countries
    if (user && user.role === "Agent") {
      filter.createdBy = user._id;
    }

    // If Admin or Normal User → show all countries (no filter on createdBy)
    // (nothing special needed, filter remains global)

    const countries = await Property.distinct("location.country", filter);

    // Remove empty strings or undefined
    const filteredCountries = countries.filter(Boolean);
    response.ok(res, "Countries fetched successfully", filteredCountries);
  } catch (error) {
    console.error("Error fetching unique countries:", error);
    response.serverError(res, "Failed to fetch countries");
  }
};
