const productModel = require("../models/productModel");
const configFile = require("config");
const fs = require("fs");

function getHomePage(req, res, next) {
  if (!req.query.category) {
    res.render("home", {
      isAdmin: req.session.isAdmin,
      isLoggedIn: req.session.userId,
      fullName: req.session.fullName,
    });
  } else {
    var category = req.query.category;
    page = parseInt(req.query.page);
    if (category.includes("_")) {
      category = category.replace("_", " & ");
    }
    const categoryies = [
      "Baby Products",
      "Beauty & Personal Care",
      "Computing",
      "Fashion",
      "Health & Beauty",
      "Phones & Tablets",
      "Replacement Parts",
    ];
    if (categoryies.includes(category)) {
      productModel
        .getItemsByCategory(category, page, req.session.isAdmin)
        .then((products) => {
          const productData = saveProductsImage(products, false);
          res.render("categoryPage", {
            productData: productData,
            page: page,
            category: category,
            categoryLink: category.replace(" & ", "_"),
            isAdmin: req.session.isAdmin,
            isLoggedIn: req.session.userId,
            fullName: req.session.fullName,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
}

function search(req, res) {
  var title;
  if (req.query && req.query.search != "") {
    title = req.query.search;
    productModel
      .search(title, req.session.isAdmin)
      .then((products) => {
        const productData = saveProductsImage(products, true);
        res.render("search", {
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
  } else {
    res.redirect("/");
  }
}

function saveProductsImage(products, search) {
  const productData = [];
  for (let i = 0; i < products.length; i++) {
    image = products[i].image;
    var fullPath = "";
    if (search) {
      fullPath = "./public/images/search/" + "product_" + i + ".jpg"; //jpg png
    } else {
      fullPath = "./public/images/category/" + "product_" + i + ".jpg"; //jpg png
    }
    const fullPath = "./public/images/category/" + "product_" + i + ".jpg"; //jpg png
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

exports.getHomePage = getHomePage;
exports.search = search;
