const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    role: { type: String, default: "user" },
    profileImagePath: { type: String, default: "" },
    // optional cached URL (can be computed server-side before sending too)
    profileImage: { type: String, default: "" },
    dateOfBirth: Date,
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});


const User = mongoose.model("User", userSchema);

module.exports = User;
