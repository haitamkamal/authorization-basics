const {Router}=require("express");
const { setUser } = require("../db/query");
const passport = require("passport");
const authorRouter = Router();
const { ensureExclusive } = require("../controller/authorController");



authorRouter.get("/",(req,res)=>{
  res.render("Index");
})
authorRouter.get("/log-in",(req,res)=>{
  res.render("loginForm")
})
authorRouter.post(
  "/log-in",
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.redirect("/"); 

      req.logIn(user, (err) => {
        if (err) return next(err);

        // Redirect based on user role
        if (user.role === "exclusive") {
          return res.redirect("/admin");
        } else {
          return res.redirect("/login-user");
        }
      });
    })(req, res, next);
  }
);

authorRouter.get("/login-user", (req, res) => {
  if (req.user) {
    res.render("loginUser", { user: req.user });
  } 
});


authorRouter.get("/sign-up",(req,res)=>{
  res.render("sign-up")
})
authorRouter.post("/sign-up",setUser)

authorRouter.get("/log-out",(req,res,next)=>{
    req.logOut((err)=>{
      if(err){
        return next(err);
      }
      res.redirect("/");
    })
})


authorRouter.get("/admin", ensureExclusive, (req, res) => {
  res.render("adminPage", { user: req.user });
});
module.exports= authorRouter;