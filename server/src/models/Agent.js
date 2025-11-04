const mongoose = require("mongoose");
const socialLinksSchema=require("./SocialLinks");

const agentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,  // one user can be only one agent
    },

    agentId: { type: String },
    gender: { type: String },
    age: { type: Number },
    isVerified: { type: Boolean, default: false },

    // Agent Details
    agency: { type: String },
    agentLicense: { type: String },
    taxNumber: { type: String },
    serviceAreas: [{ type: String }],

    // Status & Stats
    // totalListings: { type: Number, default: 0 },
    // propertiesSold: { type: Number, default: 0 },
    // propertiesRented: { type: Number, default: 0 },

    // Profile Details
    bio: { type: String },
    experience: { type: Number },
    rating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    profileImage: { type: String },

    // Social Media Links
    socialLinks: socialLinksSchema,
    // Active Listings
    activeListings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],

    // Other Info
    isActive: { type: Boolean, default: true },
    joinedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agent", agentSchema);
