const mongoose = require("mongoose");
const productModel = require("../models/productModel");
const fs = require("fs");

function getProductPage(req, res, next) {
  const productForm = req.query;
  const productId = mongoose.Types.ObjectId(productForm.id);
  console.log(productId);
  productModel
    .getProductDetails(productId)
    .then((product) => {
      const productDate = saveProductImage(product);
      console.log(productDate);
      res.render("product-details", {
        product: productDate[0],
        isAdmin: req.session.isAdmin,
        isLoggedIn: req.session.userId,
        fullName: req.session.fullName,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
function editProduct(req, res) {
  const title = req.body.title;
  const price = req.body.price;
  const id = req.body.id;
  var image;
  if (req.files) {
    const imageForm = req.files.image;
    image = imageForm.data.toString("hex");
  }
  console.log(image);
  // productModel
  //   .editProduct({ id, title, price, image })
  //   .then((product) => {
  //     console.log(product);
  //     console.log(`new price >>> ${product.price}`);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
}

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

function saveProductImage(product) {
  const productData = [];
  image = product.image;
  const fullPath =
    "./public/images/productDetails/" + "productDetails" + ".jpg"; //jpg png
  const imagePath = "productDetails" + ".jpg";
  fs.writeFileSync(fullPath, image);
  productData.push({
    id: product.id,
    title: product.title,
    price: product.price,
    imagePath: imagePath,
  });

  return productData;
}

exports.getProductPage = getProductPage;
exports.editProduct = editProduct;
exports.deleteProduct = deleteProduct;
