const userModel = require("../models/userModel");
const mongoose = require("mongoose");
const fs = require("fs");
const { redirect } = require("express/lib/response");

function getCartPage(req, res, next) {
  userModel
    .getCartProducts(req.session.userId)
    .then((cart) => {
      const cartItems = saveItemsImage(cart);
      res.render("cart", { cartItems });
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/");
    });
}
async function addToCart(req, res, next) {
  const productId = req.body.id;
  const userId = req.session.userId;

  await userModel
    .addToCart(userId, productId)
    .then((result) => {
      // console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
  res.redirect("/cart");
}

async function removeFromCart(req, res, next) {
  const userId = req.session.userId;
  productId = req.body.id;
  await userModel
    .removeFromCart(userId, productId)
    .then((result) => {
      // console.log(result);
      res.redirect("/cart");
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/cart");
    });
}
async function buyCart(req, res, next) {
  const userId = req.session.userId;
  const cart = req.body.cart;
  // console.log(cart.split(",")); // to add to history later
  await userModel
    .buyCart(userId)
    .then((result) => {
      // console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
  res.redirect("/cart");
}

function saveItemsImage(items) {
  const cartItems = [];
  for (let i = 0; i < items.length; i++) {
    image = items[i].image;
    const fullPath = "./public/images/cart/" + "product_" + i + ".jpg"; //jpg png
    const imagePath = "product_" + i + ".jpg";
    fs.writeFileSync(fullPath, image);
    cartItems.push({
      id: items[i]._id,
      title: items[i].title,
      price: items[i].price,
      imagePath: imagePath,
    });
  }
  return cartItems;
}

exports.getCartPage = getCartPage;
exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
exports.buyCart = buyCart;
