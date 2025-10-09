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
      amount: { type: Number, required: true }, // e.g. 80
      duration: { type: String, default: "Per Day" }, // e.g. "For One Day"
      currency: { type: String, default: "USD" },
    },
    rating: { type: Number, default: 0 }, // e.g. 4.5 stars
    mainImage: { type: String, required: true }, // large display image
    galleryImages: [String], // extra room images or +10 photos
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

    agent: {
      name: { type: String },
      role: { type: String, default: "Agent" },
      profileImage: { type: String },
      location: { type: String },
      totalProperties: { type: Number, default: 0 },
      contact: {
        phone: { type: String },
        email: { type: String },
      },
    },
    mapLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
