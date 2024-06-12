const pool = require("../../databasePg");
const logger = require("../utils/logger");

exports.getAllStore = async () => {
  try {
    logger.info("Retrieving all stores");
    return (await pool.query("SELECT * FROM stores")).rows;
  } catch (error) {
    logger.error(error, "Error occured while retrieving all stores");
    throw error;
  }
};

exports.createStore = async (userId, file, data) => {
  try {
    const { name, type, coordinates } = data;
    const store = (
      await pool.query(
        "INSERT INTO stores (name, logo, type, location, user_id) VALUES ($1, $2, $3, POINT($4, $5), $6) RETURNING *;",
        [name, file.filename, type, coordinates[0], coordinates[1], userId],
      )
    ).rows[0];
    logger.info(store, "Created store successfully");
    return store;
  } catch (error) {
    logger.error(error, `Error occured while creating store for user ${userId}`);
    throw error;
  }
};

exports.getProductsOfStore = async (storeId) => {
  try {
    logger.info(`Retrieving all products of store ${storeId}`);
    const store = await pool.query(
      "select s.store_id, s.name as store_name, s.location, p.product_id, p.name as product_name from stores s inner join products p on s.store_id = p.store_id where s.store_id= $1;",
      [storeId],
    );
    return store.rows;
  } catch (error) {
    logger.error(`Error occured while retrieving products of store ${storeId}`);
    throw error;
  }
};

exports.StoresNearInMeter = async (meter, location) => {
  try {
    logger.info(`Retrieving stores near ${meter}merters of location:${location}`);
    let query = `SELECT *
  FROM
    stores
  WHERE
    sqrt(
        pow(location[0] - ${location.longitude}, 2) + pow(location[1] - ${location.latitude}, 2)
    ) * 111.32 <= 1.0; -- 1.0 km in degrees`;
    const stores = (await pool.query(query)).rows;
    // const { longitude, latitude } = location;

    return stores;
  } catch (error) {
    logger.error(error, "Error occured while retrieving stores near 1km");
    throw error;
  }
};
