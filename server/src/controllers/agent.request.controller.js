const AgentRequest = require("../models/AgentRequest");
const { response } = require("../utils/response");
const User = require("../models/User");
const Agent=require("../models/Agent");

// Create new agent request
const createAgentRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const existingAgentUser = await User.findOne({ email, role: "Agent" });

   if (existingAgentUser) {
      return response.conflict(
        res,
        "This email already exists. Try a different email"
      );
    }


    const existingReq = await AgentRequest.findOne({ email });

    if (existingReq) {
      return response.conflict(
        res,
        "An agent request with this email already exists"
      );
    }
    const request = new AgentRequest(req.body);
    await request.save();
    return response.created(
      res,
      "Agent request submitted successfully",
      request
    );
  } catch (error) {
    return response.serverError(res, error.message);
  }
};

// Get all agent requests (Admin)
const getAgentRequests = async (req, res) => {
  try {
    const requests = await AgentRequest.find().sort({ createdAt: -1 });
    return response.ok(res, "Agent requests fetched successfully", requests);
  } catch (error) {
    return response.serverError(res, error.message);
  }
};

// Approve/Reject agent
const updateAgentRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await AgentRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) {
      return response.notFound(res, "Agent request not found");
    }

    return response.ok(res, "Agent request updated successfully", updated);
  } catch (error) {
    return response.serverError(res, error.message);
  }
};

module.exports = {
  createAgentRequest,
  getAgentRequests,
  updateAgentRequestStatus,
};
