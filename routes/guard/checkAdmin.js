function checkAdmin(req, res, next) {
  if (req.session.userId == "admin") next();
  else console.log("this user in not an admin");
}

exports.checkAdmin = checkAdmin;
