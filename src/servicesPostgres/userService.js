const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("../../databasePg");
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
    const result = await pool.query("SELECT * from users");
    return result.rows;
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

    let query = "INSERT into users(email, password";
    let values = "values($1, $2";

    const parameters = [userData.email, userData.password];

    if (userData.role) {
      query += ", role";
      values += ", $" + (parameters.length + 1);
      parameters.push(userData.role);
    }

    if (userData.username) {
      query += ", username";
      values += ", $" + (parameters.length + 1);
      parameters.push(userData.username);
    }
    if (userData.photo) {
      query += ", photo";
      values += ", $" + (parameters.length + 1);
      parameters.push(userData.photo);
    }
    query += `) ${values}) RETURNING user_id, email, role`;

    const newUser = (await pool.query(query, parameters)).rows[0];

    const token = signToken(newUser.user_id);

    logger.info("New user created successfully");

    return { newUser, token };
  } catch (err) {
    logger.error(err, "Error occurred while creating user:");
    throw err;
  }
};

exports.login = async (userData) => {
  try {
    const { email, password } = userData;
    if (!email || !password) {
      throw new AppError("Please provide email and password", 400);
    }

    //2) check if user exist and password is correct
    const user = (await pool.query("select * from users where email=$1", [email])).rows[0];
    if (!user || !(await bcrypt.compare(password, user.password || user.length < 1))) {
      throw new AppError("Incorrect email or password", 401);
    }

    // 3) if everything is ok send token to user
    const token = signToken(user.user_id);

    logger.info({ user: user.user_id }, "User logged in Successfully");

    return token;
  } catch (err) {
    logger.error(err, "Error occurred while logging in");
    throw err;
  }
};

exports.updateUser = async (id, userData) => {
  try {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 12);
    }

    let query = `UPDATE users SET `;
    const parameters = [];
    let index = 1;
    for (const key in userData) {
      if (index > 1) {
        query += ",";
      }
      query += `${key}=$${index}`;
      parameters.push(userData[key]);
      index++;
    }
    query += ` WHERE user_id=${id} RETURNING *`;

    const user = (await pool.query(query, parameters)).rows[0];

    if (!user) {
      throw new AppError("User not available", 404);
    }

    logger.info(user, "User is updated");
    return user;
  } catch (error) {
    logger.error(error, "Error occurred while updating user");
    throw error;
  }
};

exports.deleteUser = async (id) => {
  try {
    await pool.query("delete from users where user_id=$1", [id]);
    logger.info(`User ${id} deleted successfully`);
  } catch (err) {
    logger.error(err, "Error occurred while deleting user");
    throw err;
  }
};
