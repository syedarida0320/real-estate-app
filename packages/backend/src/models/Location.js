// models/Location.js
const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  postalCode: { type: String },
  mapLocation: {   
    lat: { type: Number },
    lng: { type: Number },
    alt: {type: Number},
  },
});

module.exports = locationSchema;
