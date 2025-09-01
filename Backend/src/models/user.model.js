const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      firstname: { type: String, required: true, trim: true },
      lastname: { type: String, trim: true },
    },
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // default queries me password return nahi hoga
    },
    avatars: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Avatar", // reference to Avatar model
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
