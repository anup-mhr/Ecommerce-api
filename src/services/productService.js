const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const logger = require("../utils/logger");

exports.getAllproducts = async () => {
  try {
    logger.info("Retrieving all products");
    return await Product.find();
  } catch (error) {
    logger.error(error, "Error occurred while retrieving all products:");
    throw error;
  }
};

exports.createProduct = async (files, productData) => {
  try {
    if (files.image) {
      productData.images = files.image.map((file) => file.filename);
    }
    if (files.coverImage) {
      productData.coverImage = files.coverImage[0].filename;
    }

    const product = await Product.create(productData);
    logger.info(product, "New product created successfully");
    return product;
  } catch (error) {
    logger.error(error, "Error occurred while adding product");
    throw error;
  }
};

exports.updateProduct = async (id, data) => {
  try {
    const newProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!newProduct) {
      throw new AppError("Product not found", 404);
    }
    logger.info(newProduct._doc, "Product is updated");

    return newProduct;
  } catch (error) {
    logger.error(error, "Error occurred while updating product:");
    throw error;
  }
};

exports.updateProductQantity = async (id, data) => {
  try {
    if (!data.quantity) {
      throw new AppError("Invalid quantity provided", 400);
    }
    const newProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!newProduct) {
      throw new AppError("Product not found", 404);
    }
    logger.info(newProduct, "Product is updated");

    return newProduct;
  } catch (error) {
    logger.error(error, "Error occurred while updating product quantity");
    throw error;
  }
};

exports.deleteProduct = async (id) => {
  try {
    await Product.findByIdAndDelete(id);
    logger.info("Deleted product successfully", { product_id: id });
  } catch (error) {
    logger.error(error, "Error occurred while deleting product");
    throw error;
  }
};

exports.searchProduct = async (queryString) => {
  try {
    logger.info("Retrieving searched products");

    //1) filtering
    console.log(queryString);
    const queryObj = { ...queryString };
    const excludedFields = ["page", "sortBy", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    //2) Advance filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find({
      name: {
        $regex: new RegExp(queryObj.q, "i"),
      },
    });

    // sorting
    if (queryString.sortBy) {
      query = query.sort(queryString.sortBy);
    }

    if (queryString.fields) {
      const fields = queryString.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    if (queryString.productType) {
      query = query.find({
        product_type: queryString.productType,
      });
    }

    //execute query
    const products = await query;
    return products;
  } catch (error) {
    logger.error(error, "Error occurred while retrieving searched products");
    throw error;
  }
};

exports.quantityLessThan5 = async () => {
  try {
    logger.info("Retrieving products having quantity < 5 ");

    return await Product.find({
      quantity: {
        $lt: 5,
      },
    });
  } catch (error) {
    logger.error(error, "Error occurred while retrieving products with quantity < 5");
    throw error;
  }
};
