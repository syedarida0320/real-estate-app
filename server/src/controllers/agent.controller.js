const Agent = require("../models/Agent");
const User = require("../models/User");
const Property = require("../models/Property");
const { response } = require("../utils/response");
const crypto = require("../utils/crypto");
const sendEmail = require("../utils/agent-email");

// ✅ Get all agents
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find()
      .populate(
        "user",
        "firstName lastName email role phone address profileImagePath emailVerifiedAt"
      )
      .sort({ createdAt: -1 });

    // ✅ Add verification status for each agent
    const formattedAgents = agents.map((agent) => ({
      ...agent.toObject(),
      isVerified: !!agent.user?.emailVerifiedAt, // ✅ true if verified
    }));

    response.ok(res, "Agents fetched successfully", formattedAgents);
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
      firstName,
      lastName,
      email,
      phone,
      agency,
      agentLicense,
      taxNumber,
      serviceAreas,
      bio,
      experience,
      facebook,
      twitter,
      instagram,
      linkedin,
      age,
      // totalListings,
      // propertiesSold,
      // propertiesRented,
    } = req.body;

    // ✅ Build address object (handle both flat and nested keys)
    let address = {};
    if (req.body.address) {
      try {
        address = JSON.parse(req.body.address); // ✅ Parse JSON string from frontend
      } catch {
        address = {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        };
      }
    }
    // console.log("Received address:", address);

    // handle image upload path
    const profileImage = req.file ? `/images/${req.file.filename}` : null;

    // ✅ Step 1: Check if a user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.conflict(res, "User already exists.");
    }

    // console.log("Creating user with data:", { firstName, email, phone });

    // ✅ Step 2: Create temporary user account (unverified)
    const tempPassword = Math.random().toString(36).slice(-8);
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      address,
      password: tempPassword,
      role: "Agent",
      // emailVerifiedAt: null,
    });

    // ✅ Step 3: Create agent profile
    const agent = await Agent.create({
      user: user._id,
      firstName,
      lastName,
      age,
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
      experience,
      // totalListings: totalListings ? Number(totalListings) : 0,
      // propertiesSold: propertiesSold ? Number(propertiesSold) : 0,
      // propertiesRented: propertiesRented ? Number(propertiesRented) : 0,
      socialLinks: { facebook, twitter, instagram, linkedin },
      profileImage,
    });

    // ✅ Step 4: Encrypt token
    const token = crypto.encrypt({ email: user.email });

    // ✅ Step 5: Send verification email
    const verifyUrl = `${process.env.FRONTEND_URL}/verify/email?token=${token}`;

    console.log("verifyUrl", verifyUrl);

    await sendEmail(
      user.email,
      "Welcome to Real Estate App - Verify Your Account",
      "agent-welcome", // this should match the .ejs filename
      {
        name: user.firstName,
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
    const agent = await Agent.findById(req.params.id)
      .populate(
        "user",
        "firstName lastName email role phone address profileImagePath emailVerifiedAt"
      )
      .populate("activeListings");

    if (!agent) return response.notFound(res, "Agent not found");

    // ✅ Include verification status
    const formattedAgent = {
      ...agent.toObject(),
      isVerified: !!agent.user?.emailVerifiedAt,
    };

    response.ok(res, "Agent fetched successfully", formattedAgent);
  } catch (error) {
    console.error("Error fetching agent:", error);
    response.serverError(res, "Failed to fetch agent");
  }
};
