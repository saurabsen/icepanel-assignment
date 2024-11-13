const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
  totalSaving: { type: Number, default: 10000 },
  transaction: [
    {
      amount: { type: Number },
      item: { type: String },
      amountType: { type: String },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
