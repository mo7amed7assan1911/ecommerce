const productModel = require("../models/productModel");
const fs = require("fs");

function getHomePage(req, res, next) {
  const category = req.query.category;
  pageNumber = parseInt(req.query.pageNumber);

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
      .getItemsByCategory(category, pageNumber)
      .then((products) => {
        const productData = saveProductsImage(products);
        res.render("categoryPage", {
          productData: productData,
          pageNumber: pageNumber,
          category: category,
        });
        console.log(productData[0].imagePath);
        console.log(productData[0].title);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.render("home");
  }
}

function saveProductsImage(products) {
  const productData = [];
  for (let i = 0; i < products.length; i++) {
    image = products[i].image;
    const fullPath = "./public/images/" + "product_" + i + ".jpg"; //jpg png
    const imagePath = "product_" + i + ".jpg";
    fs.writeFileSync(fullPath, image);
    productData.push({
      title: products[i].title,
      price: products[i].price,
      imagePath: imagePath,
    });
  }
  return productData;
}

exports.getHomePage = getHomePage;
