const Property = require('../models/Property');
const {response}=require("../utils/response");

exports.getAllProperties = async (req, res) => {
  try {
    const { status, type, country, state, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (status && status !== 'any') filter.status = status;
    if (type && type !== 'any') filter.type = type;
    if (country && country !== 'all') filter['location.country'] = country;
    if (state && state !== 'all') filter['location.state'] = state;

    const properties = await Property.find(filter)
      .populate('agent')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(filter);

    response.ok(res, "Properties fetched successfully", {
      properties,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    response.serverError(res, "Error fetching properties");
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('agent')
      .populate('owner');
    
    if (!property) {
     return response.notFound(res, "Property not found");
    }

    response.ok(res, "Property fetched successfully", property);
  } catch (error) {
    response.serverError(res, "Error fetching property");
  }
};