const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "User must have an email"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide valid email"],
  },
  password: {
    type: String,
    require: [true, ["User must have password"]],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  photo: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
