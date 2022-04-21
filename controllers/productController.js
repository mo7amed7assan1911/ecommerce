// declare global variable for product
var product = {};
function postProduct(req, res, next) {
  product = req.body;
  res.redirect(`product`);
}

function getProductPage(req, res, next) {
  res.render("product-details", {
    product: product,
  });
}

exports.postProduct = postProduct;
exports.getProductPage = getProductPage;
