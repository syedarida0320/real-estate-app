const mongoose = require("mongoose");

const socialLinksSchema = new mongoose.Schema(
  {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
  },
  { _id: false } // ✅ prevents creating an unnecessary _id for this subdocument
);

module.exports = socialLinksSchema;
