const { Pool } = require("pg");
const logger = require("./src/utils/logger");

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.POSTGRES_PORT,
});

pool.on("connect", () => {
  logger.info("Successfully connected to postgres db");
});

pool.on("release", () => {
  logger.info("Connected to postgres terminated");
});

module.exports = pool;
