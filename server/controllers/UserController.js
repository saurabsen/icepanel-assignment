// controllers/UserController.js
const User = require("../models/User");

const UserController = {
  getContacts: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).populate(
        "contacts",
        "name"
      );
      res.json(user.contacts);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving contacts" });
    }
  },

  getUserDetails: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving user details" });
    }
  },

  addContacts: async (req, res) => {
    try {
      const { userId } = req.params;
      const { contacts } = req.body;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      const newContacts = contacts.filter(
        (contactId) => !user.contacts.includes(contactId)
      );

      if (newContacts.length === 0) {
        return res
          .status(400)
          .json({ error: "All contacts are already added" });
      }

      user.contacts.push(...newContacts);
      await user.save();

      res.status(200).json({
        message: "Contacts added successfully",
        contacts: user.contacts,
      });
    } catch (error) {
      res.status(500).json({ error: "Error adding contacts" });
    }
  },

  payAmountOwed: async (req, res) => {
    try {
      const { userId, itemId } = req.body;

      const user = await User.findById(userId);
      const item = await Item.findById(itemId);

      if (!user) return res.status(404).json({ error: "User not found" });
      if (!item) return res.status(404).json({ error: "Item not found" });

      const splitDetail = item.splitBetween.find(
        (detail) => detail.user.toString() === userId
      );

      if (!splitDetail)
        return res.status(400).json({ error: "No amount owed" });

      if (user.totalSaving < splitDetail.amountOwed) {
        return res.status(400).json({ error: "Not enough savings" });
      }

      user.totalSaving -= splitDetail.amountOwed;

      item.splitBetween = item.splitBetween.filter(
        (detail) => detail.user.toString() !== userId
      );

      await user.save();
      await item.save();

      res.json({
        message: "Payment successful",
        remainingSavings: user.totalSaving,
        splitDetails: item.splitBetween,
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ error: "Error processing payment" });
    }
  },
};

module.exports = UserController;
