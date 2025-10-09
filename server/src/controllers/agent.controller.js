const Agent = require("../models/Agent");
const Property = require("../models/Property");
const { response } = require("../utils/response");
const agents=require("../data/agentsData")

exports.getAllAgents = (req, res) => {
  try {
    response.ok(res, "Agents fetched successfully", agents);
  } catch (error) {
    console.error("Error fetching properties:", error);
    response.serverError(res, "Failed to fetch properties");
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
    response.serverError(res, "Error fetching agent properties");
  }
};
