const route = require("express").Router();
const userController = require("../controllers/userController");
const gardUser = require("./guard/checkUser");
const gardAdmin = require("./guard/checkAdmin");

route.get(
  "/orders",
  gardUser.isLoggedIn,
  gardAdmin.isNotAdmin,
  userController.getOrdersPage
);

route.post(
  "/updateRating",
  gardUser.isLoggedIn,
  gardAdmin.isNotAdmin,
  userController.updateRating
);

module.exports = route;
