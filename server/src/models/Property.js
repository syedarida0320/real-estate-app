// models/Property.js
const mongoose = require("mongoose");
const locationSchema=require("./Location")

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["Apartment", "Hotel", "House", "Commercial", "Garages", "Lots"],
      required: true,
    },
    location: locationSchema,
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
      area: { type: String },
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
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
