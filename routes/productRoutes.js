const route = require("express").Router();
const productController = require("../controllers/productController");
const gardsUser = require("./guard/checkUser");
const gardsAdmin = require("./guard/checkAdmin");

route.get("/", productController.getProductPage);
route.post("/editProduct", productController.editProduct);
route.post("/deleteProduct", productController.deleteProduct);

route.post(
  "/addProduct",
  gardsUser.isLoggedIn,
  gardsAdmin.checkAdmin,
  productController.addProductPost
);
module.exports = route;
