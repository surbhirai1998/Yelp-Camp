//===========
// COMMENTS
//===========
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, camp) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { camp: camp });
    }
  });
});

router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, camp) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save(); //saving the author and id in comment IMP
          camp.comments.push(comment);
          camp.save();
          res.redirect("/campgrounds/" + camp._id);
        }
      });
    }
  });
});

//----------Middleware (for no access if not looged in)------------
function isLoggedIn(req, res, next) {
  //put this as middle ware in comments
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
module.exports = router;
