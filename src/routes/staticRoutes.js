const express = require("express");
const User = require("../models/userModel");
const Product = require("../models/productModel");

const router = express.Router();

router.get("/user", async (req, res) => {
  const users = await User.find();
  res.render("../views/user.ejs", { users });
});

router.get("/product", async (req, res) => {
  const products = await Product.find();
  res.render("../views/product", { products });
});

module.exports = router;
