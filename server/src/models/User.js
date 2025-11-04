const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    emailVerifiedAt: { type: Date },
    password: { type: String, required: true },
    phone: {
      type: String,
      // match: [/^\d{10,15}$/, "Phone number must be 10–15 digits"],
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipCode: { type: String },
    },

    role: { type: String, enum: ["User", "Agent", "Admin"], default: "User" },
    profileImagePath: { type: String, default: "" },
    dateOfBirth: Date,
  },
  {
    timestamps: true,
  }
);
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
userSchema.virtual("property", {
  ref: "Property",
  localField: "_id",
  foreignField: "userId",
  justOne: false,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
