const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  product_id: String,
  start_date: Date,
  end_date: Date,
  bidder: [
    {
      user_id: String,
      bid_amount: Number,
    },
  ],
  auction_winner_id: String,
  auction_bid_final_amount: Number,
});

const Auction = mongoose.model("Auction", auctionSchema);

module.exports = Auction;
