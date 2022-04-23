const userModel = require("../models/userModel");

function getLogin(req, res, next) {
  res.render("login", {
    error: req.flash("error")[0],
    success: req.flash("success")[0],
    isAdmin: req.session.isAdmin,
    isLoggedIn: req.session.userId,
    fullName: req.session.fullName,
  });
}
function signup(req, res, next) {
  user = req.body;
  userModel
    .saveUser(user)
    .then((resolveData) => {
      req.flash("success", resolveData);
      res.redirect("/login");
    })
    .catch((error) => {
      req.flash("error", error);
      res.redirect("/login");
    });
}
function postLogin(req, res, next) {
  user = req.body;
  if (user.userName == "admin" && user.password == "admin") {
    req.session.userId = "admin";
    req.session.isAdmin = true;
    req.session.fullName = "Admin";
    res.redirect("/");
  } else {
    userModel
      .postLogin(user)
      .then((userInDB) => {
        req.session.userId = userInDB._id;
        req.session.isAdmin = false;
        req.session.fullName = userInDB.fullName;

        res.redirect("/");
      })
      .catch((error) => {
        req.flash("error", error);
        res.redirect("/login");
      });
  }
}
function logout(req, res, next) {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
}

exports.getLogin = getLogin;
exports.signup = signup;
exports.postLogin = postLogin;
exports.logout = logout;
