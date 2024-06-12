const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const AppError = require("../utils/appError");
const logger = require("../utils/logger");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.getAllUsers = async () => {
  try {
    logger.info("Retrieving all users");
    return await User.find();
  } catch (error) {
    logger.error("Error occurred while retrieving all users:", error);
    throw new AppError("An error occurred while retrieving all users", 500);
  }
};

exports.createUser = async (userData) => {
  try {
    if (!userData.email || !userData.password) {
      throw new AppError("Missing required fields", 400);
    }

    if (userData.password.length < 8) {
      throw new AppError("Password must be at least 8 characters", 400);
    }

    //hashing the password
    userData.password = await bcrypt.hash(userData.password, 12);
    const newUser = await User.create(userData);

    const token = signToken(newUser._id);
    logger.info("New user created successfully");

    return { newUser, token };
  } catch (error) {
    logger.error(error, "Error occurred while creating user:");
    throw error;
  }
};

exports.login = async (userData) => {
  try {
    const { email, password } = userData;
    if (!email || !password) {
      throw new AppError("Please provide email and password", 400);
    }

    //2) check if user exist and password is correct
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError("Incorrect email or password", 401);
    }

    // 3) if everything is ok send token to user
    const token = signToken(user._id);
    logger.info({ user: user._id }, "User logged in Successfully");

    return token;
  } catch (error) {
    logger.error(error, "Error occurred while logging in");
    throw error;
  }
};

exports.updateUser = async (id, userData) => {
  try {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 12);
    }
    const user = await User.findByIdAndUpdate(id, userData, {
      new: true, //this will return new updated document
      runValidators: true,
    });
    if (!user) {
      throw new AppError("User not available", 404);
    }
    logger.info(user._doc, "User is updated");

    return user;
  } catch (error) {
    logger.error(error, "Error occurred while updating user");
    throw error;
  }
};

exports.deleteUser = async (id) => {
  try {
    await User.findByIdAndDelete(id);
    logger.info(`User ${id} deleted successfully`);
  } catch (error) {
    logger.error(error, "Error occurred while deleting user");
    throw error;
  }
};
