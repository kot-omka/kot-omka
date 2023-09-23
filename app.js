var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = 
        require("passport-local-mongoose")
const User = require("./model/User");
var users=[ {   userName: "faizan",  password: "faizan",  email: "mfkj@live.com"},
            {   userName: "ali",     password: "ali",     email: "xyz@live.com"},
            {   userName: "hussain", password: "hussain", email: "abc@live.com"},
            {   userName: "hassan",  password: "hassan",  email: "xyz@mail.com"},
];

var app = express();

const Schema = mongoose.Schema;

// установка схемы
const testScheme = new mongoose.Schema({
    name: {
        type: String,
        default: "NoName"
    },
    age: {
        type: Number,
        default: 22
    }
}, {collection: 'Tests' } );
const modelTest = mongoose.model("Tests", testScheme );
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

app.get('/ajax', function(request, response) {
  users.push({
    userName: request.query["userName"],
    password: request.query["password"],
    email: request.query["email"]
  });
  response.render('ajax', { users: users });
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
            const test1 = new modelTest(); // name - NoName, age - 33333
            const test2 = new modelTest({name: "Tom"}); // name - Tom, age - 22
            const test3 = new modelTest( {age:3333} ); // name - NoName, age - 34
            console.log(test3);
            await test1.save();
            test2.save();
            test3.save();
            console.log(test1);
            console.log(test2);
            console.log(test3);
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