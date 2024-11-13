const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  notes: { type: String },
  splitBetween: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      amountOwed: { type: Number },
    },
  ],
});

module.exports = mongoose.model("Item", itemSchema);
