const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db/pool");  

const app = express();


app.use(
  session({
    store: new pgSession({
      pool: pool, 
      tableName: "session", 
    }),
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: false, 
      httpOnly: true,
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Define routes
const authorRouter = require("./routes/authorRouter.js");
app.use("/", authorRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
