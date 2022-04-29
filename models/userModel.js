const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const e = require("connect-flash");
const productModel = require("../models/productModel");

const dbURL = process.env.DATABASE_URL;
function connection() {
  return mongoose.connect(dbURL);
}

const userSchema = mongoose.Schema({
  userName: String,
  password: String,
  fullName: String,
  cart: Array,
  history: Array,
});

const userModel = mongoose.model("customer", userSchema);

function saveUser(user) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        return await userModel.findOne({ userName: user.userName });
      })
      .then(async (userInDB) => {
        if (userInDB) {
          mongoose.disconnect();
          reject("user alredy exist");
        } else {
          const hashPassword = await bcrypt.hash(user.password, 10);
          user.password = hashPassword;
          const newUser = new userModel(user);
          await newUser.save();
          mongoose.disconnect();
          resolve("regiseration completed successfully");
        }
      })
      .catch((error) => {
        mongoose.disconnect();
        reject(error.message);
      });
  });
}

function postLogin(user) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        return await userModel.findOne({ userName: user.userName });
      })
      .then(async (userInDB) => {
        if (!userInDB) {
          mongoose.disconnect();
          reject("user not found");
        } else {
          const checkPassword = await bcrypt.compare(
            user.password,
            userInDB.password
          );
          if (checkPassword) {
            mongoose.disconnect();
            resolve(userInDB);
          } else {
            mongoose.disconnect();
            reject("wrong password ");
          }
        }
      })
      .catch((error) => {
        reject(error.message);
      });
  });
}

function getCartProducts(userId) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        return await userModel.findOne({ _id: userId }, { cart: 1, _id: 0 });
      })
      .then((cartObj) => {
        var itemsId = [];
        cartObj.cart.forEach((element) => {
          itemsId.push(mongoose.Types.ObjectId(element));
        });
        return itemsId;
      })
      .then(async (itemsId) => {
        await productModel.item
          .find({ _id: { $in: itemsId } }, { title: 1, price: 1, image: 1 })
          .then((items) => {
            mongoose.disconnect();
            resolve(items);
          })
          .catch((error) => {
            mongoose.disconnect();
            reject(error.message);
          });
      })
      .catch((error) => {
        mongoose.disconnect();
        reject(error.message);
      });
  });
}

function addToCart(userId, newProduct) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        return await userModel.findOne({ _id: userId }, { cart: 1, _id: 0 });
      })
      .then((cartObj) => {
        var cart = cartObj.cart;
        if (cart.length < 3) {
          if (!cart.includes(newProduct)) {
            cart.push(newProduct);
            return cart;
          } else {
            mongoose.disconnect();
            reject("This product is already in your cart");
          }
        } else {
          mongoose.disconnect();
          reject("The cart is full");
        }
      })
      .then(async (newCart) => {
        if (newCart) {
          await userModel.updateOne(
            { _id: userId },
            { $set: { cart: newCart } }
          );
          mongoose.disconnect();
          resolve("product added to cart");
        }
      })
      .catch((error) => {
        mongoose.disconnect();
        reject(error.message);
      });
  });
}

function removeFromCart(userId, newProduct) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        return await userModel.findOne({ _id: userId }, { cart: 1, _id: 0 });
      })
      .then((cartObj) => {
        var cart = cartObj.cart;
        cart.splice(cart.indexOf(newProduct), 1);
        return cart;
      })
      .then(async (newCart) => {
        if (newCart) {
          await userModel.updateOne(
            { _id: userId },
            { $set: { cart: newCart } }
          );
          mongoose.disconnect();
          resolve("product removed from cart");
        }
      })
      .catch((error) => {
        mongoose.disconnect();
        reject(error.message);
      });
  });
}

function clearCart(userId, newProduct) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        return await userModel.findOneAndUpdate({ _id: userId }, { cart: [] });
      })
      .then(() => {
        mongoose.disconnect();
        resolve("all products removed from cart");
      })
      .catch((error) => {
        mongoose.disconnect();
        reject(error.message);
      });
  });
}

function contOfUsers() {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        await userModel.aggregate(
          [
            {
              $group: {
                _id: 0,
                countUsers: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                countUsers: 1,
              },
            },
          ],
          async function (error, result) {
            if (error) {
              mongoose.disconnect();
              reject(error);
            } else {
              mongoose.disconnect();
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

exports.saveUser = saveUser;
exports.postLogin = postLogin;
exports.getCartProducts = getCartProducts;
exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
exports.clearCart = clearCart;
exports.contOfUsers = contOfUsers;
