const analyticsService = require("../servicesPostgres/analyticsService");

exports.calculateTotalRevenueFromOrders = async (req, res, next) => {
  try {
    const data = await analyticsService.calculateTotalRenevueFromOrder();
    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

exports.compareSalesPerformance = async (req, res, next) => {
  try {
    const data = await analyticsService.compareSalesPerfomanceOfProducts();
    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

exports.frequancyAndReasonForAbandonedCart = async (req, res, next) => {
  try {
    const data = await analyticsService.frequancyAndReasonForAbandonedCart();
    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

exports.calculateSalesPerformanceInRegions = async (req, res, next) => {
  try {
    const data = await analyticsService.calculateSalesPerformanceInRegions();
    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
