const res = require("express/lib/response");
const mongoose = require("mongoose");
const dbURL = process.env.DATABASE_URL;
function connection() {
  return mongoose.connect(dbURL);
}

const itemSchema = mongoose.Schema({
  title: String,
  price: Number,
  brand: String,
  image: Buffer,
  category: String,
  tags: Array,
  total_rate: Number,
  count_of_ratings: Number,
  reviews: Array,
  amount: Number,
});

const item = mongoose.model("item", itemSchema);

function getItemsByCategory(category, pageNumber) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        return await item
          .find({ category: category })
          .skip((pageNumber - 1) * 13)
          .limit(13);
      })
      .then((products) => {
        mongoose.disconnect();
        resolve(products);
      })
      .catch((error) => {
        mongoose.disconnect();
        reject(error);
      });
  });
}

function getProductDetails(productId) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        return await item.findOne(
          { _id: productId },
          {
            title: 1,
            price: 1,
            image: 1,
            category: 1,
            amount: 1,
          }
        );
      })
      .then((product) => {
        mongoose.disconnect();
        resolve(product);
      })
      .catch((error) => {
        mongoose.disconnect();
        reject(error);
      });
  });
}

function editProduct(product) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        console.log(product.id);
        if (product.image) {
          await item.updateOne(
            { _id: product.id },
            {
              title: product.title,
              price: product.price,
              image: product.image,
              amount: product.amount,
            }
          );
        } else {
          await item.updateOne(
            { _id: product.id },
            {
              title: product.title,
              price: product.price,
              amount: product.amount,
            }
          );
        }
      })
      .then(() => {
        mongoose.disconnect();
        resolve("Product updated successfully");
      })
      .catch((error) => {
        mongoose.disconnect();
        reject(error);
      });
  });
}

function deleteProduct(productId) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        return await item.deleteOne({ _id: productId });
      })
      .then(() => {
        mongoose.disconnect();
        resolve("Product deleted successfully");
      })
      .catch((error) => {
        mongoose.disconnect();
        reject(error.messages);
      });
  });
}

function addProductPost(product) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        const newProduct = new item(product);
        await newProduct.save();
        return newProduct;
      })
      .then((newProduct) => {
        mongoose.disconnect();
        resolve(newProduct._id);
      })
      .catch((error) => {
        mongoose.disconnect();
        reject(error);
      });
  });
}

function search(titleSearch) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        return await item.find({
          title: { $regex: titleSearch, $options: "i" },
        });
      })
      .then((products) => {
        mongoose.disconnect();
        resolve(products);
      })
      .catch((error) => {
        mongoose.disconnect();
        reject(error.message);
      });
  });
}

exports.getItemsByCategory = getItemsByCategory;
exports.getProductDetails = getProductDetails;
exports.editProduct = editProduct;
exports.deleteProduct = deleteProduct;
exports.addProductPost = addProductPost;
exports.search = search;
exports.item = item;
