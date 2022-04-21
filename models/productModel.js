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

exports.getItemsByCategory = getItemsByCategory;
