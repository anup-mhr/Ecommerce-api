const AppError = require("../utils/appError");
const pool = require("../../databasePg");
const logger = require("../utils/logger");

exports.getAllCarts = async () => {
  try {
    logger.info("Retrieving all carts");
    return (await pool.query("SELECT * FROM carts")).rows;
  } catch (error) {
    logger.error("Error occurred while retrieving all carts:", error);
    throw error;
  }
};

exports.addToCart = async (userId, productData) => {
  try {
    logger.info("Validating product");
    //validate product
    const product = await (
      await pool.query("SELECT * FROM products where product_id=$1", [productData.product_id])
    ).rows[0];
    if (!product) {
      logger.error("Product not found", { productId: productData.product_id });
      throw new AppError("Product is not available", 404);
    }

    //check whether user has cart
    let userCart = (await pool.query("SELECT * FROM carts where user_id=$1", [userId])).rows;

    logger.info("Execuring the query");
    //EXECUTING THE QUERY
    let cart, query;
    if (!userCart || userCart.length === 0) {
      query = `INSERT INTO carts(user_id, cart_items) values(${userId},'[${JSON.stringify(productData)}]') RETURNING *`;
    } else {
      query = `UPDATE carts
    SET cart_items = cart_items || '[${JSON.stringify(productData)}]'::jsonb
    WHERE user_id = ${userId} RETURNING *;`;
    }
    cart = (await pool.query(query)).rows[0];

    logger.info("Product added to cart successfully", cart);

    return cart;
  } catch (error) {
    logger.error("Error occured while adding to cart", error);
    throw error;
  }
};

exports.getCartByUserId = async (userId) => {
  try {
    logger.info(`Retrieving cart of user ${userId}`);
    const query = `SELECT * FROM carts where user_id=${userId}`;
    return (await pool.query(query)).rows;
  } catch (error) {
    logger.error(`Error occured while retrieving to cart of user= ${userId}`);
    throw error;
  }
};

exports.checkForAbandonedCarts = async () => {
  try {
    const query = `
      UPDATE carts
      SET abandoned = true
      WHERE CURRENT_TIMESTAMP - last_activity_time >'1 minutes' RETURNING *;
    `;
    return (await pool.query(query)).rows;
  } catch (error) {
    logger.error(`Error occured while calculating abandoned carts`);
    throw error;
  }
};
