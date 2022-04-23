// declare global variable for product
const mongoose = require("mongoose");
const productModel = require("../models/productModel");
var product = {};
function postProduct(req, res, next) {
  product = req.body;
  res.redirect(`product`);
}

function getProductPage(req, res, next) {
  product.price = +product.price;
  res.render("product-details", {
    product: product,
    isAdmin: req.session.isAdmin,
    isLoggedIn: req.session.userId,
    fullName: req.session.fullName,
  });
}
function editProduct(req, res) {}

function deleteProduct(req, res) {
  const productId = req.body.id;
  console.log(productId);
  console.log(mongoose.Types.ObjectId(productId));
  productModel
    .deleteProduct(productId)
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
}

exports.postProduct = postProduct;
exports.getProductPage = getProductPage;
exports.editProduct = editProduct;
exports.deleteProduct = deleteProduct;
