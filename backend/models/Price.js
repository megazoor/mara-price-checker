const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const priceSchema = new Schema(
  {
    ticker: { type: String, required: true },
    price: { type: Number, required: true },
    timestamp: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Price = mongoose.model("Price", priceSchema);

module.exports = Price;
