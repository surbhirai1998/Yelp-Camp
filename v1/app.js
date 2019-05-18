var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");
var methodOverride = require("method-override");
var seedDB = require("./seeds");
var flash = require("connect-flash");
//seedDB();

var app = express();

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useNewUrlParser: true
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(
  require("express-session")({
    secret: "Here we add some random text for key",
    resave: false,
    saveUninitialized: false
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user; //put res not req
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
app.use(methodOverride("_method")); //above all routes
app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes);

app.listen(8080, function() {
  console.log("yelp camp app v1 is running");
});
