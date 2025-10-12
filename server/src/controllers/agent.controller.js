const Agent = require("../models/Agent");
const Property = require("../models/Property");
const { response } = require("../utils/response");
const path=require("path");
const fs=require("fs");

// const agents=require("../data/agentsData")

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

// exports.getAllAgents = async (req, res) => {
//   try {
//     const agents = await Agent.find().populate("user").sort({ createdAt: -1 });

//     response.ok(res, "Agents fetched successfully", agents);
//   } catch (error) {
//     response.serverError(res, "Error fetching agents");
//   }
// };

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
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      email,
      country,
      properties,
    } = req.body;

    const fullName = `${firstName} ${lastName}`.trim();

    const newAgent = new Agent({
      user: req.user._id, // admin user who creates
      name: fullName,
      phone,
      email,
      country,
      role: "Agent",
      gender,
      dateOfBirth,
      totalListings: Number(properties) || 0,
      profileImage: req.file
        ? `/images/${req.file.filename}`
        : "/images/default.png",
    });

    await newAgent.save();

    response.created(res, "Agent added successfully", newAgent);
  } catch (error) {
    console.error("Error adding agent:", error);
    response.serverError(res, "Failed to add agent");
  }
};
