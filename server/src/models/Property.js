// models/Property.js
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["Apartment", "Hotel", "House", "Commercial", "Garages", "Lots"],
      required: true,
    },
    location: {
      address: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
    },
    price: {
      amount: { type: Number, required: true }, 
      duration: { type: String, default: "Per Day" }, 
      currency: { type: String, default: "USD" },
    },
    rating: { type: Number, default: 0 },
    mainImage: { type: String, required: true }, 
    galleryImages: [String], 
    facilities: {
      beds: { type: Number, default: 0 },
      baths: { type: Number, default: 0 },
      area: { type: String }, // e.g. "28M"
      smokingArea: { type: Boolean, default: false },
      kitchen: { type: Boolean, default: false },
      balcony: { type: Boolean, default: false },
      wifi: { type: Boolean, default: false },
      parkingArea: { type: Boolean, default: false },
    },
    description: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // agent: {
    //   name: { type: String },
    //   role: { type: String, default: "Agent" },
    //   profileImage: { type: String },
    //   location: { type: String },
    //   totalProperties: { type: Number, default: 0 },
    //   contact: {
    //     phone: { type: String },
    //     email: { type: String },
    //   },
    // },
    mapLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
