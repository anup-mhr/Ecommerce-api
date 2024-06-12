let cartService;
if (process.env.STORE_AREA === "mongodb") {
  cartService = require("../services/cartService");
} else if (process.env.STORE_AREA === "postgres") {
  cartService = require("../servicesPostgres/cartService");
}

exports.getAllCarts = async (req, res, next) => {
  try {
    const carts = await cartService.getAllCarts();
    res.json({
      status: "success",
      result: carts.length,
      data: carts,
    });
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    let userId = req.user._id ? req.user._id : req.user.user_id;
    const cart = await cartService.addToCart(userId, req.body);

    res.status(201).json({
      status: "success",
      msg: "Added to cart",
      data: cart,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserCart = async (req, res, next) => {
  try {
    let userId = req.user._id ? req.user._id : req.user.user_id;
    const userCart = await cartService.getCartByUserId(userId);
    res.status(200).json({
      status: "success",
      result: userCart.length,
      cart: userCart,
    });
  } catch (err) {
    next(err);
  }
};

exports.checkForAbandonedCarts = async (req, res, next) => {
  try {
    const data = await cartService.checkForAbandonedCarts();
    res.status(200).json({
      status: "success",
      result: data.length,
      data: data,
    });
  } catch (err) {
    next(err);
  }
};
