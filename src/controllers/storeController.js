let storeService;
if (process.env.STORE_AREA === "mongodb") {
  storeService = require("../services/storeService");
} else if (process.env.STORE_AREA === "postgres") {
  storeService = require("../servicesPostgres/storeService");
}

exports.createStore = async (req, res, next) => {
  try {
    const userId = req.user._id ? req.user._id : req.user.user_id;
    const store = await storeService.createStore(userId, req.file, req.body);
    res.json({
      status: "success",
      data: store,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllStore = async (req, res, next) => {
  try {
    const stores = await storeService.getAllStore();
    res.json({
      status: "success",
      data: stores,
    });
  } catch (err) {
    next(err);
  }
};

exports.findNearStores = async (req, res, next) => {
  try {
    const stores = await storeService.StoresNearInMeter(1000, req.body);
    res.json({
      status: "success",
      data: stores,
    });
  } catch (err) {
    next(err);
  }
};

exports.getStoreProducts = async (req, res, next) => {
  try {
    const productList = await storeService.getProductsOfStore(req.params.storeId);
    res.json({
      status: "success",
      data: productList,
    });
  } catch (err) {
    next(err);
  }
};
