var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
//var Comment     = require("../models/comment");
var middleware  = require("../middleware"); // if you specify directory instead of a file then node picksup index.js
                                            // from that directory


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
   var price = req.body.price;
   var description = req.body.description;
   
   var author = { id: req.user._id,
                  username : req.user.username
   };
   var newCampGround = {name: name, price: price, image: image, description: description, author: author};
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

router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

router.get("/campgrounds/:id", middleware.isLoggedIn, function(req, res){
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        
        if(err){
            console.log("error");
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
        
});

// Edit Campground
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership,function(req, res){
    
         Campground.findById(req.params.id, function(err, foundCampground){
        
            if(err){
                console.log("error");
            } else {
                     res.render("campgrounds/edit", {campground: foundCampground});
                
            }
        });
 });

// Update Campground
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
   
    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        
        if(err){
            console.log("error");
            res.redirect("/campgrounds");
        } else {
            
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});
    

// Destroy Campground
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
   
    
    Campground.findByIdAndRemove(req.params.id, function(err){
        
        if(err){
            console.log("error");
            res.redirect("/campgrounds");
        } else {
            
            res.redirect("/campgrounds");
        }
    });
});
    

/*function isLoggedIn(req,res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


function checkCampgroundOwnership(req, res, next){
    
       if(req.isAuthenticated()){
         Campground.findById(req.params.id, function(err, foundCampground){
        
            if(err){
                res.redirect("back");
            } else {
                // does user own campground?? foundCampground.author.is is object ad req.user.id is string
                // so use mongoose method rquals.
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                    //res.send("You are not authorised");
                }
                
            }
        });
    } else {
        res.redirect("back");
    }
   
}*/


module.exports = router;