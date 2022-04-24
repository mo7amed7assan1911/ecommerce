const route = require("express").Router();
const productController = require("../controllers/productController");

route.get("/", productController.getProductPage);
route.post("/editProduct", productController.editProduct);
route.post("/deleteProduct", productController.deleteProduct);

module.exports = route;
