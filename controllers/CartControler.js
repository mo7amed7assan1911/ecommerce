const userModel = require("../models/userModel");
const ordersModel = require("../models/ordersModel");
const productModel = require("../models/productModel");
const mongoose = require("mongoose");
const configFile = require("../config");
const fs = require("fs");

function getCartPage(req, res, next) {
  userModel
    .getCartProducts(req.session.userId)
    .then((cart) => {
      const cartItems = saveItemsImage(cart);
      res.render("cart", {
        cartItems,
        isAdmin: req.session.isAdmin,
        isLoggedIn: req.session.userId,
        fullName: req.session.fullName,
      });
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
      console.log(result);
      res.redirect("/cart");
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/cart");
    });
}
async function buyCart(req, res, next) {
  const userId = req.session.userId;
  const cart = req.body.cart.split(",");
  const date = new Date();
  const dateString = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  if (typeof req.body.title == "object") {
    for (let i = 0; i < cart.length; i++) {
      if (req.body.amount[i] == 0) {
        return res.redirect("/cart");
      }
      const oldImagePath = req.body.imagePath[i];
      const newPath = "./public/images/orders/" + cart[i] + ".jpg";
      fs.copyFile(oldImagePath, newPath, (err) => {
        if (err) console.log(err);
        console.log("File was copied");
      });

      const order = {
        id: cart[i],
        userName: req.session.userName,
        imagePath: cart[i] + ".jpg",
        title: req.body.title[i],
        amount: +req.body.amount[i],
        totalPrice: +req.body.price[i] * +req.body.amount[i],
        date: dateString,
      };

      const amountData = {
        id: mongoose.Types.ObjectId(cart[i]),
        amount: +req.body.amount[i],
      };
      await productModel
        .changeAmount(amountData)
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
        });

      await ordersModel
        .saveOrder(order)
        .then((resolvedData) => {
          console.log(resolvedData);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  } else {
    if (req.body.amount == 0) {
      return res.redirect("/cart");
    }
    const oldImagePath = req.body.imagePath;
    const newPath = "./public/images/orders/" + cart + ".jpg";
    fs.copyFile(oldImagePath, newPath, (err) => {
      if (err) console.log(err);
      console.log("File was copied");
    });
    const order = {
      id: cart,
      userName: req.session.userName,
      imagePath: cart + ".jpg",
      title: req.body.title,
      amount: +req.body.amount,
      totalPrice: +req.body.price * +req.body.amount,
      date: dateString,
    };

    const amountData = {
      id: mongoose.Types.ObjectId(req.body.cart),
      amount: +req.body.amount,
    };

    await productModel
      .changeAmount(amountData)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });

    await ordersModel
      .saveOrder(order)
      .then((resolvedData) => {
        console.log(resolvedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  await userModel
    .clearCart(userId)
    .then((result) => {
      console.log(result);
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
      amount: items[i].amount,
    });
  }
  return cartItems;
}

exports.getCartPage = getCartPage;
exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
exports.buyCart = buyCart;
