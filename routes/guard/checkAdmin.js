function checkAdmin(req, res, next) {
  if (req.session.userId == "admin") next();
  else console.log("this user in not an admin");
}
function isNotAdmin(req, res, next) {
  if (req.session.userId !== "admin") next();
  else res.redirect("/");
}
exports.checkAdmin = checkAdmin;
exports.isNotAdmin = isNotAdmin;
