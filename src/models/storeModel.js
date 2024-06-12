const mongoose = require("mongoose");

const storeSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Store should have a name"],
  },
  logo: String,
  type: {
    type: String,
    required: [true, "Store must have a type"],
  },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: [Number],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
