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

function getItemsByCategory(category, pageNumber, isAdmin) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        if (isAdmin) {
          return await item
            .find({ category: category })
            .skip((pageNumber - 1) * 13)
            .limit(13);
        } else {
          return await item
            .find({ category: category, amount: { $gt: 0 } })
            .skip((pageNumber - 1) * 13)
            .limit(13);
        }
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
            reviews: 1,
            total_rate: 1,
            count_of_ratings: 1,
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

function search(titleSearch, isAdmin) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        if (isAdmin) {
          return await item.find({
            title: { $regex: titleSearch, $options: "i" },
          });
        } else {
          return await item.find({
            title: { $regex: titleSearch, $options: "i" },
            amount: { $gt: 0 },
          });
        }
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

function changeAmount(amountData) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        return await item.findOne(
          { _id: amountData.id },
          { _id: 0, amount: 1 }
        );
      })
      .then(async (oldAmount) => {
        console.log(`oldAmount >>> ${oldAmount.amount}`);
        const newAmount = oldAmount.amount - amountData.amount;
        return await item.updateOne(
          { _id: amountData.id },
          { amount: newAmount }
        );
      })
      .then(() => {
        mongoose.disconnect();
        resolve("amount apdated successfully");
      })
      .catch((error) => {
        mongoose.disconnect();
        reject(error.message);
      });
  });
}

function saveUserRate(productId, userRate) {
  const newProductId = mongoose.Types.ObjectId(productId);

  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        return await item.findOne(
          { _id: newProductId },
          { reviews: 1, total_rate: 1, count_of_ratings: 1 }
        );
      })
      .then(async (product) => {
        var reviews = product.reviews;
        if (reviews.length > 0) {
          for (let i = 0; i < reviews.length; i++) {
            if (reviews[i].userName == userRate.userName) {
              const oldUserRate = reviews[i].rate;
              product.total_rate -= oldUserRate;
              product.total_rate += userRate.rate;

              reviews[i].rate = userRate.rate;
              reviews[i].comment = userRate.comment;

              return product;
            }
          }
          reviews.push(userRate);
          product.total_rate += userRate.rate;
          product.count_of_ratings += 1;
          return product;
        } else {
          reviews.push(userRate);
          product.total_rate += userRate.rate;
          product.count_of_ratings += 1;
          return product;
        }
      })
      .then(async (newProduct) => {
        await item.updateOne(
          { _id: newProductId },
          {
            total_rate: newProduct.total_rate,
            count_of_ratings: newProduct.count_of_ratings,
            reviews: newProduct.reviews,
          }
        );
      })
      .then(() => {
        resolve("rating updated successfully");
      })
      .catch((error) => {
        mongoose.disconnect();
        reject(error.message);
      });
  });
}

function getLastReview(userName, productId) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        const allReviews = await item.findOne(
          { _id: productId },
          { reviews: 1, _id: 0 }
        );
        return allReviews.reviews;
      })
      .then((allReviews) => {
        if (allReviews.length > 0) {
          for (let i = 0; i < allReviews.length; i++) {
            if (allReviews[i].userName == userName) {
              resolve(allReviews[i]);
            } else {
              continue;
            }
          }
          resolve({ comment: "", rate: 0 });
        } else {
          resolve({ comment: "", rate: 0 });
        }
      });
  });
}

exports.getItemsByCategory = getItemsByCategory;
exports.getProductDetails = getProductDetails;
exports.editProduct = editProduct;
exports.deleteProduct = deleteProduct;
exports.addProductPost = addProductPost;
exports.search = search;
exports.changeAmount = changeAmount;
exports.saveUserRate = saveUserRate;
exports.getLastReview = getLastReview;
exports.item = item;
