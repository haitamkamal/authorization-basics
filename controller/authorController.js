function ensureExclusive(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  
  console.log("User role:", req.user.role); // Debugging line

  if (req.user.role === "exclusive") {
    return next();
  }
  
  res.redirect("/");
}
module.exports = { ensureExclusive };
