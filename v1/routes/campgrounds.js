var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX route--show all
router.get("/campgrounds", function(req, res) {
  Campground.find({}, function(err, camps) {
    if (err) {
      req.flash(
        "error",
        "Cannot Display Campgrounds at the moment! Please Refresh the page."
      );
    } else {
      res.render("campgrounds/campgrounds", { camps: camps });
    }
  });
});
//NEW -form to create
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});
//CREATE route--create new
router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
  var name = req.body.name;
  var url = req.body.url;
  var price = req.body.price;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  /*var obj = {
      name: name,
      url: url
    };*/
  //camps.push(obj);
  Campground.create(
    {
      name: name,
      price: price,
      url: url,
      description: description,
      author: author
    },
    function(err, c) {
      if (err) {
        req.flash("error", "Something went wrong");
      } else {
        req.flash("success", "Successfully added the campground");
      }
    }
  );
  res.redirect("/campgrounds");
});

//SHOW--when user clicks on 1 camp
router.get("/campgrounds/:id", function(req, res) {
  var id = req.params.id;
  //inside campground we want comments(not just ids)
  Campground.findById(id)
    .populate("comments")
    .exec(function(err, camp) {
      if (err || !camp) {
        req.flash("error", "Campground not found");
        res.redirect("/campgrounds");
      } else {
        res.render("campgrounds/show", { camp: camp });
      }
    });

  /*
    Campground.findOne({ _id: id }, function(err, camp) {
      if (err) {
        console.log("error dispalying the camps");
      } else {
        res.render("show", { camp: camp });
      }
    });
    
    */
});

//EDIT
router.get(
  "/campgrounds/:id/edit",
  middleware.checkCampgroundOwnership,
  function(req, res) {
    Campground.findById(req.params.id, function(err, camp) {
      res.render("campgrounds/edit", { camp: camp });
    });
  }
);

//UPDATE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(
  req,
  res
) {
  Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(
    err,
    camp
  ) {
    if (err || !camp) {
      req.flash("error", "Something went wrong");
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Successfully updated the campground");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DESTROY
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(
  req,
  res
) {
  //the route should be coming from a form
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      req.flash("success", "Successfully deleted the campground");
      res.redirect("/campgrounds");
    }
  });
});

//----------Middleware (for no access if not looged in)------------

module.exports = router;
