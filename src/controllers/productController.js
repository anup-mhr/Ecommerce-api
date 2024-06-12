let productService;
if (process.env.STORE_AREA === "mongodb") {
  productService = require("../services/productService");
} else if (process.env.STORE_AREA === "postgres") {
  productService = require("../servicesPostgres/productService");
}

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllproducts();
    res.json({
      status: "Success",
      result: products.length,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.files, req.body);
    // res.redirect('/pages/product')      //use this only when using ejs
    res.status(201).json({
      status: "Success",
      msg: "Product added",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const newProduct = await productService.updateProduct(req.params.productId, req.body);
    res.status(200).json({
      status: "Success",
      msg: "Product has been updated",
      data: newProduct,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.productId);
    res.status(204).json({
      status: "success",
      msg: "Product deleted Successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProductQantity = async (req, res, next) => {
  try {
    const newProduct = await productService.updateProductQantity(req.params.productId, req.body);
    res.status(200).json({
      status: "Success",
      msg: "Product quantity has been updated",
      data: newProduct,
    });
  } catch (err) {
    next(err);
  }
};

exports.filterProducts = async (req, res, next) => {
  try {
    const products = await productService.searchProduct(req.query);
    res.status(200).json({
      status: "success",
      result: products.length,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

exports.outOfStock = async (req, res, next) => {
  try {
    const products = await productService.quantityLessThan5();
    res.status(200).json({
      status: "Success",
      result: products.length,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};
