const {Router}=require("express");
const { setUser } = require("../db/query");
const passport = require("passport");
const authorRouter = Router();
const { isExclusiveMember } = require("../controller/authorController");



authorRouter.get("/",(req,res)=>{
  res.render("Index");
})
authorRouter.get("/log-in",(req,res)=>{
  res.render("loginForm")
})
authorRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/login-user",
    failureRedirect: "/",   
  })
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


/*authorRouter.get("/admin", isExclusiveMember, (req, res) => {
  res.render("admin", { user: req.user });
});*/

module.exports= authorRouter;