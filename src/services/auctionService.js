const AppError = require("../utils/appError");
const Auction = require("../models/auctionModel");
const Product = require("../models/productModel");
const logger = require("../utils/logger");

exports.getAllAuctions = async () => {
  try {
    logger.info("Retrieving all auctions");

    return await Auction.find();
  } catch (error) {
    logger.error("Error occured while retrieving al auctions", error);
    throw error;
  }
};

exports.getAuctionById = async (auctionId) => {
  try {
    logger.info(`Retrieving auction`, auctionId);

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      throw new AppError("Auction not available", 404);
    }
    return auction;
  } catch (error) {
    logger.error(`Error occured while retrieving auction ${auctionId}`, error);
    throw error;
  }
};

exports.createAuction = async (productId, endDate) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const currentTime = new Date();
    endDate = new Date(endDate);
    const timeDiff = endDate - currentTime;
    if (timeDiff < 0) {
      throw new AppError("Invalid end time selection", 400);
    }
    const auction = await Auction.create({
      product_id: productId,
      start_date: new Date(),
      end_date: endDate,
    });
    logger.info("Auction created successfully", auction);

    return auction;
  } catch (error) {
    logger.error("Error occured while creating an auction", error);
    throw error;
  }
};

exports.bidAuction = async (auctionId, userId, bid_amount) => {
  try {
    logger.info(auctionId, "Validating the auction");
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      throw new AppError("Invalid auction id", 404);
    }

    //checking if time limit is exceeded
    if (auction.end_date < Date.now()) {
      throw new AppError("This auction has been finished", 400);
    }

    logger.info({ auctionId, userId }, "Bidding for the auction");
    const bid = await Auction.findByIdAndUpdate(
      auctionId,
      { $push: { bidder: { user_id: userId, bid_amount } } },
      { new: true },
    );
    logger.info(`user ${userId} successfully bidded for auction ${auctionId}`);

    return bid;
  } catch (error) {
    logger.error("Error occured while bidding an auction", error);
    throw error;
  }
};

exports.getBiddersOfAuctionItem = async (auctionId) => {
  try {
    logger.info(`Retrieving the bidder of auction ${auctionId}`);
    const bidderList = await Auction.findById(auctionId).select("bidder -_id ");
    if (!bidderList) {
      throw new AppError("Invalid auction id", 404);
    }
    return bidderList;
  } catch (error) {
    logger.error("Error occured while retrieving bidders", error);
    throw error;
  }
};

exports.decideAuctionWinner = async (auctionId) => {
  try {
    logger.info(`Deciding the winner of the auction ${auctionId}`);

    const auction = await this.getAuctionById(auctionId);

    if (auction.end_date > Date.now()) {
      throw new AppError("It is not eligible yet", 400);
    }

    logger.info("Calculating the winner");
    //calculating winner
    const winner = auction.bidder.reduce((acc, curr) => {
      if (curr.bid_amount > acc.bid_amount) acc = curr;
      return acc;
    });

    logger.info("Updating the auction");
    //updating auction for winner
    const updatedAuction = await Auction.findByIdAndUpdate(
      auctionId,
      {
        auction_winner_id: winner.user_id,
        auction_bid_final_amount: winner.bid_amount,
      },
      { new: true },
    );

    logger.info(`Winner of the auction ${auctionId} is decided`);
    return updatedAuction;
  } catch (error) {
    logger.error("Error occured while deciding the winner");
    throw error;
  }
};
