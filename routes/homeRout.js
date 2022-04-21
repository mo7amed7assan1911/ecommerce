const route = require("express").Router();
const homeController = require("../controllers/homeController");

route.get("/", homeController.getHomePage);

module.exports = route;
