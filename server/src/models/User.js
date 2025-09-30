const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: { type: String, required: true },
    phone: {
      type: String,
      match: [/^\d{10,15}$/, "Phone number must be 10–15 digits"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    role: { type: String, default: "user" },
    profileImagePath: { type: String, default: "" },
    // profileImage: { type: String, default: "" },
    dateOfBirth: Date,
    // createdAt: { type: Date, default: Date.now },
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
