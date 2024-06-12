let orderService;
if (process.env.STORE_AREA === "mongodb") {
  orderService = require("../services/orderService");
} else if (process.env.STORE_AREA === "postgres") {
  orderService = require("../servicesPostgres/orderService");
}

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json({
      status: "success",
      result: orders.length,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

exports.checkoutOrder = async (req, res, next) => {
  try {
    const userId = req.user._id ? req.user._id : req.user.user_id;
    const newOrder = await orderService.checkoutOrder(userId, req.body.cartId);
    res.status(200).json({
      status: "success",
      msg: "Order has been placed",
      data: newOrder,
    });
  } catch (err) {
    next(err);
  }
};
