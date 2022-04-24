const productModel = require("../models/productModel");
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
        .getItemsByCategory(category, page)
        .then((products) => {
          const productData = saveProductsImage(products);
          res.render("categoryPage", {
            productData: productData,
            page: page,
            category: category,
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

function saveProductsImage(products) {
  const productData = [];
  for (let i = 0; i < products.length; i++) {
    image = products[i].image;
    // image = new Buffer.from(products[i].image, "hex");
    const fullPath = "./public/images/category/" + "product_" + i + ".jpg"; //jpg png
    const imagePath = "product_" + i + ".jpg";
    fs.writeFileSync(fullPath, image);
    productData.push({
      id: products[i]._id,
      title: products[i].title,
      price: products[i].price,
      imagePath: imagePath,
    });
  }
  return productData;
}

exports.getHomePage = getHomePage;
