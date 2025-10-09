const Property = require("../models/Property");
const { response } = require("../utils/response");
// const properties = require("../data/propertiesData");

exports.getAllProperties = async (req, res) => {
  try {
    const user = req.user;
    let filter = {};

    if (user.role === "agent") {
      filter.createdBy = user._id; // Agent can see only his own
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });
    response.ok(res, "Properties fetched successfully", properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    response.serverError(res, "Failed to fetch properties");
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try from MongoDB first
    let property = await Property.findById(id);

    // fallback: check dummy data if DB doesn’t have it
    if (!property) {
      property = properties.find(
        (p) =>
          p._id?.toString() === id.toString() ||
          p.id?.toString() === id.toString()
      );
    }

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
    if (user.role !== "admin" && user.role !== "agent") {
      return response.forbidden(
        res,
        "Access denied: Only admin or agent can add properties"
      );
    }

    const propertyData = req.body;

    // If agent, tag property with agent info
    if (user.role === "agent") {
      propertyData.agent = {
        name: user.name,
        role: "Agent",
        profileImage: user.profileImage || "",
        location: user.location || "",
        totalProperties: 0,
        contact: { phone: user.phone || "", email: user.email || "" },
      };
      propertyData.createdBy = user._id;
    }

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
