var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, camp) {
      if (err) {
        console.log(err);
        res.redirect("back"); //1 page back
      } else {
        if (camp.author.id.equals(req.user._id)) {
          //== not used as camp.author.id is a mongoose object while other one is string
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};
middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err) {
        res.redirect("back");
      }
      next();
    });
  } else {
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};
module.exports = middlewareObj;
