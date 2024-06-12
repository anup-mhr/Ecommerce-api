const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/utils/swagger");

const AppError = require("./src/utils/appError");
const globalErrorHandler = require("./src/middleware/globalErrorHandler");
const logger = require("./src/utils/logger");

const userRouter = require("./src/routes/userRoutes");
const productRouter = require("./src/routes/productRouter");
const cartRouter = require("./src/routes/cartRoutes");
const orderRouter = require("./src/routes/orderRoutes");
const auctionRouter = require("./src/routes/auctionRoutes");
const storeRouter = require("./src/routes/storeRoutes");
const analyticsRouter = require("./src/routes/analyticsRoutes");
const staticRouter = require("./src/routes/staticRoutes");

const app = express();

app.set("view engine", "ejs");

app.use(express.json()); //for parsing json
app.use(express.urlencoded({ extended: false })); //for reading form data
app.use(express.static("dev-data")); //for ui views

//ROUTES
app.use("/pages", staticRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);
app.use("/auctions", auctionRouter);
app.use("/analytics", analyticsRouter);
app.use("/store", storeRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Invalid url handling middleware
app.all("*", (req, res, next) => {
  logger.error(`Can't find ${req.originalUrl} on this server`);
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
