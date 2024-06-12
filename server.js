const dotenv = require("dotenv");
const mongoose = require("mongoose");
const logger = require("./src/utils/logger");

const port = process.env.PORT || 3000;

dotenv.config();
const app = require("./app");

if (process.env.STORE_AREA === "mongodb") {
  mongoose
    .connect(process.env.DATABASE_LOCAL)
    .then(() => logger.info("Successfully connected to mongodb"))
    .catch((err) => {
      logger.fatal("Failed to connect to the mongodb:", err);
      process.exit(1); // Terminate the application
    });
}

app.listen(port, () => {
  logger.info(`Listening on localhost port ${port}`);
  logger.info(`Documentation available at http://localhost:${port}/docs`);
});
