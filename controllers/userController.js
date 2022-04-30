const userModel = require("../models/userModel");
const orderModel = require("../models/ordersModel");
const productModel = require("../models/productModel");

async function getOrdersPage(req, res) {
  var userOrders;
  // get orders of user
  await orderModel
    .getUserOrders(req.session.userName)
    .then(async (result) => {
      userOrders = await result;
    })
    .catch((err) => {
      console.log(err);
    });

  res.render("orders", {
    userOrders: userOrders,
    isAdmin: req.session.isAdmin,
    isLoggedIn: req.session.userId,
    fullName: req.session.fullName,
  });
}

function updateRating(req, res) {
  const userRate = {
    userName: req.session.userName,
    rate: +req.body.rate,
    comment: req.body.comment,
  };
  productModel
    .saveUserRate(req.body.id, userRate)
    .then((resolveData) => {
      console.log(resolveData);
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/user/orders");
}
exports.getOrdersPage = getOrdersPage;
exports.updateRating = updateRating;
