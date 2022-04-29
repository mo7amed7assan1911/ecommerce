const route = require("express").Router();
const adminController = require("../controllers/adminController");
const gardUser = require("./guard/checkUser");
const gardAdmin = require("./guard/checkAdmin");

route.get(
  "/",
  gardUser.isLoggedIn,
  gardAdmin.checkAdmin,
  adminController.getAdminPage
);

module.exports = route;
