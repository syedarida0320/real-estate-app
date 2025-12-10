const fs = require("fs");
const path = require("path");
const Agent = require("../models/Agent");
const User = require("../models/User");
const Property = require("../models/Property");
const { response } = require("../utils/response");
const crypto = require("../utils/crypto");
const sendEmail = require("../utils/agent-email");

const uploadDir = path.join(__dirname, "..", "public", "images");
// it make sure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Get all agents
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find()
      .populate(
        "user",
        "firstName lastName email role phone address profileImagePath emailVerifiedAt"
      )
      .sort({ createdAt: -1 });

    // ✅ Add total property counts for each agent
    const agentsWithCounts = await Promise.all(
      /* This code snippet is mapping over an array of agents and for each agent, it is asynchronously
      counting the total number of listings associated with that agent. */
      agents.map(async (agent) => {
        const totalListings = await Property.countDocuments({
          createdBy: agent.user._id,
        });

        return {
          /* This code snippet is creating a new object by spreading the properties of the `agent`
          object using the spread operator (`...agent.toObject()`). */
          ...agent.toObject(),
          isVerified: !!agent.user?.emailVerifiedAt,
          totalListings,
        };
      })
    );

    response.ok(res, "Agents fetched successfully", agentsWithCounts);
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
  let uploadedFilePath = null; // ✅ store the actual path here for cleanup if needed
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

    // ✅ handle profile image manually
    let profileImage = null;
    if (req.file) {
      const uniqueName = `${Date.now()}-${req.file.originalname}`;
      const imagePath = path.join(uploadDir, uniqueName);

      // write the buffer to disk
      fs.writeFileSync(imagePath, req.file.buffer); // write file to disk
      uploadedFilePath = imagePath; // ✅ store the path for cleanup if needed
      // set relative path for frontend access
      profileImage = `/images/${uniqueName}`;
    }

    // ✅ Step 1: Check if a user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // ✅ Delete uploaded image if user already exists
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
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
    response.created(res, "Agent added successfully", agent);
  } catch (error) {
    console.error("Error adding agent:", error);

    // ✅ Delete uploaded image if something failed
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      try {
        fs.unlinkSync(uploadedFilePath);
        console.log(
          "Deleted uploaded image due to error:",
          uploadedFilePath
        );
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }

    response.serverError(res, "Failed to add agent");
  }
};

exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).populate(
      "user",
      "firstName lastName email role phone address profileImagePath emailVerifiedAt"
    );
    // .populate("activeListings");

    if (!agent) return response.notFound(res, "Agent not found");

    // Dynamic properties counts

    // ✅ Fetch all active properties added by this agent
    const activeListings = await Property.find({
      createdBy: agent.user._id,
      status: { $in: ["active", "available"] }, // adjust if your schema uses 'listed', etc.
    }).sort({ createdAt: -1 });

    const totalListings = await Property.countDocuments({
      createdBy: agent.user._id,
    });
    const propertiesSold = await Property.countDocuments({
      createdBy: agent.user._id,
      status: "sold",
    });

    const propertiesRented = await Property.countDocuments({
      createdBy: agent.user._id,
      status: "rented",
    });

    // ✅ Include verification status
    const formattedAgent = {
      ...agent.toObject(),
      isVerified: !!agent.user?.emailVerifiedAt,
      totalListings,
      propertiesSold,
      propertiesRented,
      activeListings,
    };

    response.ok(res, "Agent fetched successfully", formattedAgent);
  } catch (error) {
    console.error("Error fetching agent:", error);
    response.serverError(res, "Failed to fetch agent");
  }
};

