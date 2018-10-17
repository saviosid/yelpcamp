var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var middleware  = require("../middleware"); // if you specify directory instead of a file then node picksup index.js
                                            // from that directory


router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    
    // find campground
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log("error finding campground");}
        else {
                res.render("comments/new", {campground: campground});
        }
        
    });
   
});
    
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
    
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
                         // add username & id to comment
                         
                         // save comment
                         comment.author.id = req.user._id;
                         comment.author.username = req.user.username;
                         comment.save();
                         campground.comments.push(comment);
                         campground.save();
                         
                         // redirect to show pageres.render("comments/new", {campground: campground});
                         res.redirect("/campgrounds/"+ campground._id);
                
                     }
                     
                });
                
                
        
             
         }
    });
   
});

// comment edit route

router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err + "=="+ req.params.comment_id);
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
        
    });
       
});

//comments update route

router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        
        if(err){
            console.log("error");
            res.redirect("back");
        } else {
            
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
       
});

// comments destroy route

router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
   
    
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        
        if(err){
            console.log("error");
            res.redirect("back");
        } else {
            
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});


/*function isLoggedIn(req,res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCommentOwnership(req, res, next){
    
       if(req.isAuthenticated()){
         Comment.findById(req.params.comment_id, function(err, foundComment){
        
            if(err){
                res.redirect("back");
            } else {
                // does user own comment?? foundCampground.author.is is object ad req.user.id is string
                // so use mongoose method rquals.
                if(foundComment.author.id.equals(req.user._id)){
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