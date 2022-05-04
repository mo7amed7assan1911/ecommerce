const mongoose = require("mongoose");
const productModel = require("../models/productModel");
// const configFile = require("../config");
const fs = require("fs");

function getProductPage(req, res, next) {
  const productForm = req.query;
  const productId = mongoose.Types.ObjectId(productForm.id);
  productModel
    .getProductDetails(productId)
    .then((product) => {
      const productDate = saveProductImage(product);
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
  const productId = req.body.id;
  const id = mongoose.Types.ObjectId(productId);
  const amount = req.body.amount;
  var image;
  if (req.files) {
    image = req.files.image.data;
  }
  productModel
    .editProduct({ id, title, price, image, amount })
    .then((resolveDate) => {
      console.log(resolveDate);
      res.redirect(`/product/?id=${productId}`);
    })
    .catch((error) => {
      console.log(error);
    });
}

function deleteProduct(req, res) {
  const productId = req.body.id;
  console.log(productId);
  console.log(mongoose.Types.ObjectId(productId));
  productModel
    .deleteProduct(productId)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/");
}

function addProductPage(req, res) {
  res.render("addProduct", {
    isAdmin: req.session.isAdmin,
    isLoggedIn: req.session.userId,
    fullName: req.session.fullName,
  });
}

function addProductPost(req, res) {
  const image = req.files.image;

  const imageType = image.name.split(".");
  if (imageType[imageType.length - 1] !== "jpg") {
    console.log("jpg image only");
    return res.redirect("/addProduct");
  }

  const product = req.body;
  product.image = image.data;

  productModel
    .addProductPost(product)
    .then((id) => {
      console.log(id);
      res.redirect(`/product/?id=${id}`);
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/addProduct");
    });
}

function saveProductImage(product) {
  const productData = [];
  image = product.image;
  const fullPath =
    "./public/images/productDetails/" + "productDetails" + ".jpg";
  const imagePath = "productDetails" + ".jpg";
  fs.writeFileSync(fullPath, image);
  productData.push({
    id: product.id,
    title: product.title,
    price: product.price,
    category: product.category,
    imagePath: imagePath,
    amount: product.amount,
    reviews: product.reviews,
    rating: Math.round(product.total_rate / product.count_of_ratings),
  });

  return productData;
}

exports.getProductPage = getProductPage;
exports.editProduct = editProduct;
exports.deleteProduct = deleteProduct;
exports.addProductPage = addProductPage;
exports.addProductPost = addProductPost;
