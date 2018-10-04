var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var Comment     = require("../models/comment")


router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    
    // find campground
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log("error finding campground");}
        else {
                res.render("comments/new", {campground: campground});
        }
        
    });
   
});
    
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    
    // find campground using id
    
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log("error finding campground");
            res.redirect("/campgrounds");
        }
        else {
                // create comment
                Comment.create(req.body.comment, function(err, comment){
                     if (err){
                        console.log("error comment");
                         res.redirect("/campgrounds");
                     } else {
                         // connect comment t campground
                         campground.comments.push(comment);
                         campground.save();
                         
                         // redirect to show pageres.render("comments/new", {campground: campground});
                         res.redirect("/campgrounds/"+ campground._id);
                
                     }
                     
                });
                
                
        
             
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