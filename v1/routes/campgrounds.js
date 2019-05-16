var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//INDEX route--show all
router.get("/campgrounds", function(req, res) {
  Campground.find({}, function(err, camps) {
    if (err) {
      console.log("error dispalying the camps");
    } else {
      res.render("campgrounds/campgrounds", { camps: camps });
    }
  });
});
//NEW -form to create
router.get("/campgrounds/new", isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});
//CREATE route--create new
router.post("/campgrounds", isLoggedIn, function(req, res) {
  var name = req.body.name;
  var url = req.body.url;
  var description = req.body.description;
  /*var obj = {
      name: name,
      url: url
    };*/
  //camps.push(obj);
  Campground.create(
    {
      name: name,
      url: url,
      description: description
    },
    function(err, c) {
      if (err) {
        console.log("error in adding camp");
      } else {
        console.log("camp added");
        console.log(c);
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
      if (err) {
        console.log(err);
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
//----------Middleware (for no access if not looged in)------------
function isLoggedIn(req, res, next) {
  //put this as middle ware in comments
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
module.exports = router;
