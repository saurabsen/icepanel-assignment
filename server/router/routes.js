// routes.js
const express = require("express");
const UserController = require("../controllers/UserController");
const ItemController = require("../controllers/ItemController");
const AuthController = require("../controllers/AuthController");

const router = express.Router();

// Auth routes
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// User routes
router.get(
  "/users/:userId/contacts",
  AuthController.authenticate,
  UserController.getContacts
);
router.get(
  "/users/:userId",
  AuthController.authenticate,
  UserController.getUserDetails
);
router.post("/users/:userId/contacts", UserController.addContacts);

// Item routes
router.post("/items/add", AuthController.authenticate, ItemController.addItem);
router.get("/items", AuthController.authenticate, ItemController.getUserItems);
router.get(
  "/items/:itemId",
  AuthController.authenticate,
  ItemController.getItemDetails
);
router.post(
  "/bills/split",
  AuthController.authenticate,
  ItemController.splitBill
);

module.exports = router;
