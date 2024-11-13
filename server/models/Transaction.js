const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  amount: { type: Number },
  item: { type: String },
  amountType: { type: String },
});

module.exports = mongoose.model("Transaction", transactionSchema);
