const Agent = require("../models/Agent");
const Property = require("../models/Property");
const { response } = require("../utils/response");
const crypto = require("../utils/crypto"); 
const sendEmail = require("../utils/agent-email"); 
const User = require("../models/User");

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
    console.error("Error fetching properties:", error);
    response.serverError(res, "Error fetching agent properties");
  }
};

exports.createAgent = async (req, res) => {
  try {
    // ✅ Only Admin can add agents
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

    // ✅ Step 1: Check if a user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return response.conflict(res, "User already exists with this email");

    // ✅ Step 2: Create temporary user account (unverified)
    const tempPassword = Math.random().toString(36).slice(-8);
    const user = await User.create({
      firstName: name,
      lastName: "",
      email,
      password: tempPassword,
      role: "Agent",
      emailVerifiedAt: null,
    });

    // ✅ Step 3: Create agent profile
    const agentData = {
      user: user._id,
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

    // ✅ Step 4: Encrypt token
    const token = crypto.encrypt({ email: user.email });

    // ✅ Step 5: Send verification email
    const verifyUrl = `${process.env.FRONTEND_URL}/verify/email?token=${token}`;

    console.log("verifyUrl", verifyUrl);
    
    await sendEmail(
      user.email,
      "Welcome to Real Estate App - Verify Your Account",
      "agent-welcome", // 👈 this should match the .ejs filename
      {
        name,
        email: user.email,
        agentId: agent._id,
        verifyUrl,
      }
    );

    // ✅ Step 6: Send response
    response.created(res, "Agent created and verification email sent.", agent);
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
