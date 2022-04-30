const mongoose = require("mongoose");
const dbURL = process.env.DATABASE_URL;
function connection() {
  return mongoose.connect(dbURL);
}

const orderSchema = mongoose.Schema({
  productId: String,
  userName: String,
  imagePath: String,
  title: String,
  amount: Number,
  totalPrice: Number,
  date: String,
});

const orderModel = mongoose.model("order", orderSchema);

function saveOrder(order) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        const newOrder = new orderModel(order);
        await newOrder.save();
        mongoose.disconnect();
        resolve("orders saved successfully");
      })
      .catch((error) => {
        console.log(error.message);
      });
  });
}

function countAndSumPrice() {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        await orderModel.aggregate(
          [
            {
              $group: {
                _id: 0,
                totalPrice: { $sum: "$totalPrice" },
                countProducts: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                totalPrice: 1,
                countProducts: 1,
              },
            },
          ],
          async function (error, result) {
            if (error) {
              mongoose.disconnect();
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      })
      .catch((error) => {
        mongoose.disconnect();
        reject(error);
      });
  });
}

function getAllOrders() {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        return await orderModel.find({});
      })
      .then((allOrders) => {
        resolve(allOrders);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
}

function getUserOrders(userName) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        return await orderModel.find({ userName: userName }, { userName: 0 });
      })
      .then(async (userOrders) => {
        mongoose.disconnect();
        resolve(userOrders);
      })
      .catch((error) => {
        mongoose.disconnect();
        reject(error.message);
      });
  });
}

exports.saveOrder = saveOrder;
exports.getAllOrders = getAllOrders;
exports.countAndSumPrice = countAndSumPrice;
exports.getUserOrders = getUserOrders;
