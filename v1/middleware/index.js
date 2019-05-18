var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, camp) {
      if (err || !camp) {
        // !camp because of error if id is too short or tampered then null object returned passes through if(err) and app might break
        req.flash("error", "Campground not found");
        res.redirect("back"); //1 page back
      } else {
        if (camp.author.id.equals(req.user._id)) {
          //== not used as camp.author.id is a mongoose object while other one is string
          next();
        } else {
          req.flash("error", "You are not allowed to edit that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You must be logged in to do that");
    res.redirect("back");
  }
};
middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err || !comment) {
        req.flash("error", "Comment not found");
        res.redirect("back");
      }
      if (comment.author.id.equals(req.user._id)) {
        next();
      } else {
        req.flash("error", "You are not allowed to edit that");
        res.redirect("back");
      }
    });
  } else {
    req.flash("error", "You must be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You must be logged in for that.");
  res.redirect("/login");
};
module.exports = middlewareObj;
