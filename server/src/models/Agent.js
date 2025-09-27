// models/Agent.js
const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  agency: String,
  licenseNumber: String,
  taxNumber: String,
  serviceAreas: [String],
  bio: String,
  specialties: [String],
  experience: Number,
  totalListings: { type: Number, default: 0 },
  propertiesSold: { type: Number, default: 0 },
  propertiesRented: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  isActive: { type: Boolean, default: true },
  joinedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Agent", agentSchema);
