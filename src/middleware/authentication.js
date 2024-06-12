const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const pool = require("../../databasePg");
const logger = require("../utils/logger");

exports.verify = async (req, res, next) => {
  try {
    logger.info("Starting token verification process");

    // 1) getting token and check its there
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
      logger.error("Token not found in headers");
      return next(new AppError("You are not logged in! Please login to get access", 401));
    }
    const token = req.headers.authorization.split(" ")[1];

    // 2) validate token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info("Token validated successfully");

    // 3) check if user still exist
    let user;
    if (process.env.STORE_AREA === "mongodb") {
      user = await User.findById(decoded.id);
    } else if (process.env.STORE_AREA === "postgres") {
      const result = await pool.query(
        "select user_id, username, email, role from users where user_id=$1",
        [decoded.id],
      );
      user = result.rows[0];
    }
    if (!user) {
      logger.error("User belonging to this token does not exist");
      return next(new AppError("the user belonging to this token does o longer exist", 401));
    }

    logger.info("User retrieved successfully");
    // 4) grant access to protected routes
    req.user = user;
    next();
  } catch (err) {
    logger.error("Error occurred during token verification", { error: err });
    next(new AppError("JWT token expired", 401));
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    try {
      logger.info("Starting access restriction process");
      if (!roles.includes(req.user.role)) {
        logger.fatal(`Unauthorized access attempt by user ${req.user.username}`);
        return next(new AppError("You do not have permission to perform this task", 403));
      }
      logger.info("User has permission to perform this task");
      next();
    } catch (err) {
      logger.error("Error occurred during access restriction", { error: err });
      next(err);
    }
  };
};
