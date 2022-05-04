const userModel = require("../models/userModel");
const orderModel = require("../models/ordersModel");
const productModel = require("../models/productModel");
const fs = require("fs");

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

  // get cont of all users
  await userModel.contOfUsers().then((result) => {
    const keys = Object.keys(result[0]);
    const values = Object.values(result[0]);
    aggregateData[keys[0]] = values[0];
  });

  res.render("dashboard", {
    aggregateData: aggregateData,
    allOrders: allOrders,
    isAdmin: req.session.isAdmin,
    isLoggedIn: req.session.userId,
    fullName: req.session.fullName,
  });
}

function emptyProduct(req, res) {
  var title;
  title = req.query.search;
  productModel
    .getEmptyProducts(title, req.session.isAdmin)
    .then((products) => {
      const productData = saveProductsImage(products);
      res.render("empatyProducts", {
        productData: productData,
        page: 1,
        resultAmount: productData.length,
        isAdmin: req.session.isAdmin,
        isLoggedIn: req.session.userId,
        fullName: req.session.fullName,
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function saveProductsImage(products) {
  const productData = [];
  for (let i = 0; i < products.length; i++) {
    image = products[i].image;
    const fullPath = "./public/images/empty/" + "product_" + i + ".jpg"; //jpg png
    const imagePath = "product_" + i + ".jpg";
    fs.writeFileSync(fullPath, image);
    productData.push({
      id: products[i].id,
      title: products[i].title,
      price: products[i].price,
      imagePath: imagePath,
      rating: products[i].total_rate / products[i].count_of_ratings,
    });
  }
  return productData;
}

exports.getAdminPage = getAdminPage;
exports.emptyProduct = emptyProduct;
