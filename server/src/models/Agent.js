const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Basic Info
  name: { type: String, required: true },
  role: { type: String, default: "Agent" },
  age: { type: Number },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  postCode: { type: String },
  phone: { type: String },
  email: { type: String },
  agentId: { type: String },
  gender: { type: String },
  dateOfBirth:{type:String},


  // Agent Details
  agency: { type: String },
  agentLicense: { type: String },
  taxNumber: { type: String },
  serviceAreas: [{ type: String }],

  // Status & Stats
  totalListings: { type: Number, default: 0 },
  propertiesSold: { type: Number, default: 0 },
  propertiesRented: { type: Number, default: 0 },

  // Profile Details
  bio: { type: String },
  experience: { type: Number },
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  profileImage: { type: String },

  // Social Media Links
  socialLinks: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
  },
  // Active Listings
  activeListings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],

  // Other Info
  isActive: { type: Boolean, default: true },
  joinedDate: { type: Date, default: Date.now },
},
  {timestamps:true});

module.exports = mongoose.model("Agent", agentSchema);
