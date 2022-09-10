const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      trim: true,
    },
    lname: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
      default: "",
    },
    coverImage: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      max: 50,
      unique: true,
    },

    password: { type: String, required: true, min: 8, max: 15, trim: true },

    followers: {
      type: Array,
      default: [],
    },

    followings: {
      type: Array,
      default: [],
    },

    isAdmin: {
      type: Boolean,
      deafult: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
