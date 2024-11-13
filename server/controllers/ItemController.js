// controllers/ItemController.js
const Item = require("../models/Item");
const User = require("../models/User");

const ItemController = {
  addItem: async (req, res) => {
    try {
      const { name, amount, notes } = req.body;
      const userId = req.user.id;

      const newItem = new Item({
        name,
        amount,
        paidBy: userId,
        notes,
      });

      await newItem.save();
      await User.findByIdAndUpdate(userId, { $push: { items: newItem._id } });

      res
        .status(201)
        .json({ message: "Item added successfully", item: newItem });
    } catch (error) {
      res.status(500).json({ error: "Error adding item" });
    }
  },

  getUserItems: async (req, res) => {
    try {
      const userId = req.user.id;

      const items = await Item.find({
        $or: [{ paidBy: userId }, { "splitBetween.user": userId }],
      });

      res.json(items);
    } catch (error) {
      console.error("Error retrieving items:", error);
      res.status(500).json({ error: "Error retrieving items" });
    }
  },

  getItemDetails: async (req, res) => {
    try {
      const item = await Item.findById(req.params.itemId).populate(
        "splitBetween.user",
        "name"
      );
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving item details" });
    }
  },

  splitBill: async (req, res) => {
    try {
      const { itemId, contacts } = req.body;

      const item = await Item.findById(itemId).populate("paidBy", "name");
      if (!item) return res.status(404).json({ error: "Item not found" });

      const validUsers = await User.find(
        { _id: { $in: contacts } },
        "_id name items totalSaving transaction"
      );
      if (validUsers.length !== contacts.length) {
        return res.status(400).json({
          error: "Some users in the contact list are not registered.",
        });
      }

      const splitAmount = item.amount / (validUsers.length + 1);

      item.splitBetween = validUsers.map((user) => ({
        user: user._id,
        amountOwed: splitAmount,
      }));

      await item.save();

      await Promise.all(
        validUsers.map(async (user) => {
          const transactionType = user._id.equals(item.paidBy._id)
            ? "Paid"
            : "Owes";

          user.items.push(item._id);

          if (transactionType === "Paid") {
            user.totalSaving -= item.amount;
          }

          user.transaction.push({
            amount: transactionType === "Paid" ? item.amount : splitAmount,
            item: item.name,
            amountType: transactionType,
          });

          await user.save();
        })
      );

      res.json({
        message: "Bill split successfully",
        totalAmount: item.amount,
        payer: item.paidBy.name,
        splitDetails: item.splitBetween,
      });
    } catch (error) {
      console.error("Error splitting bill:", error);
      res.status(500).json({ error: "Error splitting bill" });
    }
  },
};

module.exports = ItemController;
