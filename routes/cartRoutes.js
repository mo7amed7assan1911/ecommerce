const cartController = require("../controllers/CartControler");
const gardUser = require("./guard/checkUser");
const gardAdmin = require("./guard/checkAdmin");

const route = require("express").Router();

route.get(
  "/",
  gardUser.isLoggedIn,
  gardAdmin.isNotAdmin,
  cartController.getCartPage
);

route.post(
  "/addToCart",
  gardUser.isLoggedIn,
  gardAdmin.isNotAdmin,
  cartController.addToCart
);

route.post("/remove", cartController.removeFromCart);
route.post("/buy", cartController.buyCart);

module.exports = route;
