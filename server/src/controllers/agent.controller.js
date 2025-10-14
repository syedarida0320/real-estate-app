const Agent = require("../models/Agent");
const Property = require("../models/Property");
const { response } = require("../utils/response");
// const path = require("path");
// const fs = require("fs");

// ✅ Get all agents
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    response.ok(res, "Agents fetched successfully", agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    response.serverError(res, "Failed to fetch agents");
  }
};

exports.getAgentProperties = async (req, res) => {
  try {
    const properties = await Property.find({ agent: req.params.id }).sort({
      createdAt: -1,
    });
    response.ok(res, "Agent properties fetched successfully", properties);
  } catch (error) {
    console.error("Error fetching properties", properties);
    response.serverError(res, "Error fetching agent properties");
  }
};

exports.createAgent = async (req, res) => {
  try {
    // Only Admin can add
    if (req.user.role !== "Admin")
      return response.unauthorized(res, "Only Admins can add agents");

    const {
      name,
      role,
      age,
      city,
      state,
      country,
      postCode,
      phone,
      email,
      agency,
      agentLicense,
      taxNumber,
      serviceAreas,
      bio,
      totalListings,
      propertiesSold,
      propertiesRented,
      facebook,
      twitter,
      instagram,
    } = req.body;
    const profileImage = req.file ? `/images/${req.file.filename}` : null;

    const agentData = {
      user: req.user._id,
      name,
      role: role || "Agent",
      age,
      city,
      state,
      country,
      postCode,
      phone,
      email,
      agency,
      agentLicense,
      taxNumber,
      serviceAreas: serviceAreas
        ? Array.isArray(serviceAreas)
          ? serviceAreas
          : String(serviceAreas)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
        : [],
      bio,
      totalListings: totalListings ? Number(totalListings) : 0,
      propertiesSold: propertiesSold ? Number(propertiesSold) : 0,
      propertiesRented: propertiesRented ? Number(propertiesRented) : 0,
      socialLinks: { facebook, twitter, instagram },
      profileImage,
    };
    const agent = await Agent.create(agentData);

    response.created(res, "Agent added successfully", agent);
  } catch (error) {
    console.error("Error adding agent:", error);
    response.serverError(res, "Failed to add agent");
  }
};
exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).populate(
      "activeListings"
    );
    if (!agent) return response.notFound(res, "Agent not found");
    response.ok(res, "Agent fetched successfully", agent);
  } catch (error) {
    console.error("Error fetching agent:", error);
    response.serverError(res, "Failed to fetch agent");
  }
};
