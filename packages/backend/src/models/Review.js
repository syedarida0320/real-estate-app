// models/Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  title: String,
  comment: String,
  reviewCode: String, // Like AC1025A
  status: {
    type: String,
    enum: ["published", "deleted"],
    default: "published",
  },
  serviceType: String, // Like "Privindly service"
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);
