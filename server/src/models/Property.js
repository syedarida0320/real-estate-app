const mongoose = require("mongoose");
const locationSchema = require("./Location");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["Apartment", "Hotel", "House", "Commercial", "Garages", "Lots"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },

    availabilityType: {
      type: String,
      enum: ["for_rent", "for_sale", "sold"],
      required: true,
      default: "for_sale",
    },

    location: locationSchema,
    price: {
      amount: { type: Number, required: true },
      duration: { type: String, default: null },
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

// ✅ Auto-handle duration logic before saving
propertySchema.pre("save", function (next) {
  if (this.availabilityType === "for_sale") {
    this.price.duration = null;
  }
  next();
});

module.exports = mongoose.model("Property", propertySchema);
