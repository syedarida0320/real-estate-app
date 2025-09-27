// models/Property.js
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["hotel", "apartment", "house", "commercial"],
      required: true,
    },
    status: {
      type: String,
      enum: ["for sale", "for rent", "sold"],
      required: true,
    },
    price: { type: Number, required: true },
    location: {
      address: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    details: {
      beds: Number,
      baths: Number,
      area: String,
      kitchen: Boolean,
      balcony: Boolean,
      wifi: Boolean,
    },
    description: String,
    images: [String],
    agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    facilities: [String],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timeseries: true,
  }
);

module.exports = mongoose.model("Property", propertySchema);
