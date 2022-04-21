function isLoggedIn(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect("/login");
  }
}
function notLoggedIn(req, res, next) {
  if (!req.session.userId) next();
  else res.redirect("/");
}

exports.isLoggedIn = isLoggedIn;
exports.notLoggedIn = notLoggedIn;
