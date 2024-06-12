const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: [true, "User id is required"],
  },
  cart: {
    type: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: [true, "Product is required"],
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    required: [true, "Cart is required"],
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
