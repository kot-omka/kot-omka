var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = 
        require("passport-local-mongoose")
const User = require("./model/User");
var app = express();
  
mongoose.connect("mongodb://localhost/27017");
  
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "nothing secret",
    resave: false,
    saveUninitialized: false
}));
app.use(express.static('public'));  
app.use(passport.initialize());
app.use(passport.session());

  
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
  
//=====================
// ROUTES
//=====================
  
// Showing home page
app.get("/", function (req, res) {
    res.render("home");
});
  
// Showing secret page
app.get("/secret", isLoggedIn, function (req, res) {
    res.render("secret");
});
 
// Showing register form
app.get("/register", function (req, res) {
    res.render("register");
});
  
// Handling user signup
app.post("/register", async (req, res) => {
    const user = await User.create({
      username: req.body.username,
      password: req.body.password
    });
    
    return res.status(200).json(user);
  });
  
//Showing login form
//app.engine('html', require('ejs').renderFile);

app.get("/login", function (req, res) {
    res.render("login", { name: 'login_error' });
});
app.get("/ajax", function (req, res) {
    res.render("ajax", json({ name1: 'login_error' }));
});  
//Handling user login
app.post("/login", async function(req, res){
    try {
        // check if the user exists
        const user = await User.findOne({ username: req.body.username });
        if (user) {
          //check if password matches
          const result = req.body.password === user.password;
          if (result) {
            res.render("secret");
          } else {
            //res.status(400).json({ error: "password doesn't match" });
         res.render("login", { name: "password doesn't match" });
          }
        } else {
          res.render("login", { name: "user doesn't exist" });
         //res.status(400).json({ error: "user doesn't exist" });
        }
      } catch (error) {
           res.render("login", { name: error });
       //res.status(400).json({ error });
      }
});
  
//Handling user logout 
app.get("/logout", function (req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});

app.post("/ajax", async function(req, res){
    try {
        // check if the user exists
        const user = await User.findOne({ username: req.body.username });
        if (user) {
          //check if password matches
          const result = req.body.password === user.password;
          if (result) {
            res.render("secret");
          } else {
            //res.status(400).json({ error: "password doesn't match" });
         res.render("ajax", { name: "password doesn't match" });
          }
        } else {
          res.render("ajax", { name: "user doesn't exist" });
         //res.status(400).json({ error: "user doesn't exist" });
        }
      } catch (error) {
           res.render("ajax", { name: error });
       //res.status(400).json({ error });
      }
});
 
  
  
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}
  
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});