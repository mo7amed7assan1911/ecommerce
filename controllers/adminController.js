const userModel = require("../models/userModel");
const orderModel = require("../models/ordersModel");

async function getAdminPage(req, res) {
  var aggregateData = {};
  var allOrders;

  // get all orders
  await orderModel
    .getAllOrders()
    .then(async (result) => {
      allOrders = await result;
    })
    .catch((err) => {
      console.log(err);
    });

  // get count of all orders and totla price
  await orderModel.countAndSumPrice().then((result) => {
    const keys = Object.keys(result[0]);
    const values = Object.values(result[0]);
    aggregateData[keys[0]] = values[0];
    aggregateData[keys[1]] = values[1];
  });

  // get cont of all user
  await userModel.contOfUsers().then((result) => {
    const keys = Object.keys(result[0]);
    const values = Object.values(result[0]);
    aggregateData[keys[0]] = values[0];
  });

  const adminData = res.render("dashboard", {
    aggregateData: aggregateData,
    allOrders: allOrders,
    isAdmin: req.session.isAdmin,
    isLoggedIn: req.session.userId,
    fullName: req.session.fullName,
  });
}
exports.getAdminPage = getAdminPage;
