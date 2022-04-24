function checkAdmin(req, res, next) {
  if (req.session.userId == "admin") next();
  else res.redirect("/");
}
function isNotAdmin(req, res, next) {
  if (req.session.userId !== "admin") next();
  else res.redirect("/");
}
exports.checkAdmin = checkAdmin;
exports.isNotAdmin = isNotAdmin;
