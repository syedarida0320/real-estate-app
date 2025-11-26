const mongoose = require("mongoose");

// Your URL validation function (integrated properly)
function isValidURL(str) {
    const pattern = /^(http(s)?:\/\/)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g;
  return pattern.test(str);
}

const socialLinksSchema = new mongoose.Schema(
    {
     facebook: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || isValidURL(v); // allow empty or valid URL
        },
        message: "Invalid Facebook URL format.",
      },
    },

    twitter: {
      type: String,
      validate: {
        validator: function (v) {
            return !v || isValidURL(v);
          },
          message: "Invalid Twitter URL format.",
      },
    },

     instagram: {
        type: String,
      validate: {
        validator: function (v) {
          return !v || isValidURL(v);
        },
        message: "Invalid Instagram URL format.",
      },
    },
    
    linkedin: {
      type: String,
      validate: {
          validator: function (v) {
          return !v || isValidURL(v);
        },
        message: "Invalid LinkedIn URL format.",
      },
    },

  },
  { _id: false } // ✅ prevents creating an unnecessary _id for this subdocument
);

module.exports = socialLinksSchema;