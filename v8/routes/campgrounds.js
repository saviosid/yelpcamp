var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var Comment     = require("../models/comment")


router.get("/campgrounds", function(req,res){
     //retrieve campgrounds fromm DB
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
            }
        });
});

router.post("/campgrounds", function(req, res){
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   var newCampGround = {name: name, image: image, description: description};
   Campground.create(newCampGround, function(err, campground){
        if(err){
            console.log(err);
        } else {
            console.log("New Campground Created");
            console.log(campground);
        } 
    });
   //redirect to /campgrounds
   res.redirect("/campgrounds");
});

router.get("/campgrounds/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

router.get("/campgrounds/:id", isLoggedIn, function(req, res){
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        
        if(err){
            console.log("error");
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
        
});

function isLoggedIn(req,res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = router;