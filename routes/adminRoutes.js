const route = require("express").Router();
const adminController = require("../controllers/adminController");

route.get("/");

module.exports = route;
