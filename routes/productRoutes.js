const route = require("express").Router();
const productController = require("../controllers/productController");

route.post("/", productController.postProduct);
route.get("/", productController.getProductPage);
route.post("/addToCart", productController.addToCart);
module.exports = route;
