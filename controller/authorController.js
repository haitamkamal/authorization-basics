function ensureExclusive(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/log-in"); 
  }

  if (req.user.role === "exclusive") {
    return next();
  }

  res.redirect("/login-user"); // Redirect members instead of sending them to the home page
}

module.exports = { ensureExclusive };
