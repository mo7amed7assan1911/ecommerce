const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const res = require("express/lib/response");

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

exports.saveUser = saveUser;
exports.postLogin = postLogin;
