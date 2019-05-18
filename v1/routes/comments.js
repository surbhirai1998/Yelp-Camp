//===========
// COMMENTS
//===========
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(
  req,
  res
) {
  Campground.findById(req.params.id, function(err, camp) {
    if (err || !camp) {
      req.flash("error", "Campground not found");
      res.redirect("/campgrounds");
    } else {
      res.render("comments/new", { camp: camp });
    }
  });
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(
  req,
  res
) {
  Campground.findById(req.params.id, function(err, camp) {
    if (err || !camp) {
      req.flash("error", "Campground not found");
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          req.flash("error", err.message);
          res.redirect("/campgrounds/" + req.params.id);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save(); //saving the author and id in comment IMP
          camp.comments.push(comment);
          camp.save();
          req.flash("success", "Successfully added comment");
          res.redirect("/campgrounds/" + camp._id);
        }
      });
    }
  });
});

router.get(
  "/campgrounds/:id/comments/:comment_id/edit",
  middleware.checkCommentOwnership,
  function(req, res) {
    Campground.findById(req.params.id, function(err, camp) {
      if (err || !camp) {
        req.flash("error", "Campground not found");
        res.redirect("/campgrounds");
      } else {
        Comment.findById(req.params.comment_id, function(err, comment) {
          res.render("comments/edit", {
            comment: comment,
            campground_id: req.params.id
          });
        });
      }
    });
  }
);
/* if put route not working then check for?_method also app.use(_method) above routes in app.js*/
router.put(
  "/campgrounds/:id/comments/:comment_id",
  middleware.checkCommentOwnership,
  function(req, res) {
    Campground.findById(req.params.id, function(err, camp) {
      if (err || !camp) {
        req.flash("error", "Campground not found");
        res.redirect("/campgrounds");
      } else {
        Comment.findByIdAndUpdate(
          req.params.comment_id,
          req.body.comment,
          function(err, comment) {
            if (err) {
              req.flash("error", err.message);
              res.redirect("back");
            }
            req.flash("success", "Successfully updated the comment");
            res.redirect("/campgrounds/" + req.params.id);
          }
        );
      }
    });
  }
);

router.delete(
  "/campgrounds/:id/comments/:comment_id",
  middleware.checkCommentOwnership,
  function(req, res) {
    Campground.findById(req.params.id, function(err, camp) {
      if (err || !camp) {
        req.flash("error", "Campground not found");
        res.redirect("/campgrounds");
      } else {
        Comment.findByIdAndRemove(req.params.comment_id, function(err) {
          if (err) {
            req.flash("error", err.message);
            res.redirect("back");
          } else {
            req.flash("success", "Successfully deleted the comment");
            res.redirect("/campgrounds/" + req.params.id);
          }
        });
      }
    });
  }
);

//----------Middleware (for no access if not looged in)------------

module.exports = router;
