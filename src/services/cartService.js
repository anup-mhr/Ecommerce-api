const AppError = require("../utils/appError");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const logger = require("../utils/logger");

exports.getAllCarts = async () => {
  try {
    logger.info("Retrieving all carts");

    return await Cart.find();
  } catch (error) {
    logger.error("Error occurred while retrieving all carts:", error);
    throw error;
  }
};

exports.addToCart = async (userId, productData) => {
  try {
    logger.info("Validating product");

    const product = await Product.findById(productData.product_id);
    if (!product) {
      logger.error("Product not found", { productId: productData.product_id });

      throw new AppError("Product is not available", 404);
    }

    let userCart = await Cart.findOne({ user_id: userId });
    let cart;
    if (!userCart || userCart.length === 0) {
      cart = await Cart.create({
        user_id: userId,
        cart: [productData],
      });
    } else {
      userCart.cart.push(productData);
      cart = await userCart.save();
    }
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

    return await Cart.find({ user_id: userId });
  } catch (error) {
    logger.error(`Error occured while retrieving to cart of user= ${userId}`);
    throw error;
  }
};
