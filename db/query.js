const { Passport } = require("passport");
const pool = require("./pool");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");



async function setUser(req, res) {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
  // Ensure role comes from the request body, with a default value
  const role = req.body.role ? req.body.role : "member";  

  await pool.query(
    "INSERT INTO member (email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5)",
    [
      req.body.email,
       hashedPassword, 
       req.body.first_name, 
       req.body.last_name, 
       role]
  );

  res.redirect("/");
}

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        console.log("Login Attempt for:", email);

        const { rows } = await pool.query("SELECT * FROM member WHERE email = $1", [email]);
        const user = rows[0];

        if (!user) {
          console.log("User not found!");
          return done(null, false, { message: "Incorrect email" });
        }

        console.log("User found:", user);
        const match = await bcrypt.compare(password,user.password)
        if (!match) {
          console.log("Incorrect password!");
          return done(null, false, { message: "Incorrect password" });
        }

        console.log("Login successful!");
        return done(null, user);
      } catch (err) {
        console.log("Error during authentication:", err);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user.id); // Make sure user has an `id` field
});

// Deserialize user (retrieve user from database using ID)
passport.deserializeUser(async (id, done) => {
  try {
    console.log("Deserializing user with ID:", id);
    const { rows } = await pool.query("SELECT * FROM member WHERE id = $1", [id]);
    
    if (!rows.length) {
      return done(null, false);
    }

    done(null, rows[0]); // Ensure this contains the `role` field
  } catch (err) {
    done(err);
  }
});

// Login strategy
passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM member WHERE email = $1", [email]);
      
      if (!rows.length) {
        return done(null, false, { message: "No user found" });
      }

      const user = rows[0];

      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);


 
module.exports={
  setUser
}