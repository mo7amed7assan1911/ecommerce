const route = require("express").Router();
const homeController = require("../controllers/homeController");
const productController = require("../controllers/productController");
const gardsUser = require("./guard/checkUser");
const gardsAdmin = require("./guard/checkAdmin");

route.get("/", homeController.getHomePage);
route.get(
  "/addProduct",
  gardsUser.isLoggedIn,
  gardsAdmin.checkAdmin,
  productController.addProductPage
);
route.get("/search", homeController.search);
module.exports = route;
