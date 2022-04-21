const route = require("express").Router();
const loginController = require("../controllers/loginController");
const gards = require("./guard/checkUser");

route.get("/", gards.notLoggedIn, loginController.getLogin);

route.post("/login", gards.notLoggedIn, loginController.postLogin);

route.post("/signup", gards.notLoggedIn, loginController.signup);

route.get("/logout", gards.isLoggedIn, loginController.logout);

module.exports = route;
