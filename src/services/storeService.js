const Store = require("../models/storeModel");
const ObjectId = require("mongoose").Types.ObjectId;
const logger = require("../utils/logger");

exports.getAllStore = async () => {
  try {
    logger.info("Retrieving all stores");
    return await Store.find();
  } catch (error) {
    logger.error(error, "Error occured while retrieving all stores");
    throw error;
  }
};

exports.createStore = async (userId, file, data) => {
  try {
    const { name, type, coordinates } = data;
    const store = await Store.create({
      name,
      type,
      user_id: userId,
      location: {
        type: "Point",
        coordinates,
      },
      logo: file.filename,
    });
    logger.info(store._doc, "Created store successfully");

    return store;
  } catch (error) {
    logger.error(error, `Error occured while creating store for user ${userId}`);
    throw error;
  }
};

exports.getProductsOfStore = async (storeId) => {
  try {
    logger.info(`Retrieving all products of store ${storeId}`);

    const store = await Store.aggregate([
      { $match: { _id: new ObjectId(storeId) } }, //converting str to obj
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "store_id",
          as: "productList",
        },
      },
    ]);
    return store[0].productList;
  } catch (error) {
    logger.error(`Error occured while retrieving products of store ${storeId}`);
    throw error;
  }
};

exports.StoresNearInMeter = async (meter, location) => {
  try {
    logger.info(`Retrieving stores near ${meter}merters of location:${location}`);

    const { longitude, latitude } = location;
    const stores = await Store.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: meter,
          // $minDiastance: 10
        },
      },
    });
    return stores;
  } catch (error) {
    logger.error(error, "Error occured while retrieving stores near 1km");
    throw error;
  }
};
