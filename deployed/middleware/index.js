//all middleware
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var middlewareObj ={};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    
       if(req.isAuthenticated()){
         Campground.findById(req.params.id, function(err, foundCampground){
        
            if(err || !foundCampground){
                req.flash("error","Campground not found");
                res.redirect("back");
            } else {
                // does user own campground?? foundCampground.author.is is object ad req.user.id is string
                // so use mongoose method rquals.
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error","You do not have permission");
                    res.redirect("back");
                    //res.send("You are not authorised");
                }
                
            }
        });
    } else {
        req.flash("error","Please login...");
        res.redirect("back");
    }
   
};

middlewareObj.checkCommentOwnership= function(req, res, next){
    
       if(req.isAuthenticated()){
         Comment.findById(req.params.comment_id, function(err, foundComment){
        
            if(err){
                req.flash("error","Comment not found");
                res.redirect("back");
            } else {
                // does user own comment?? foundCampground.author.is is object ad req.user.id is string
                // so use mongoose method rquals.
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error","You do not have permission");
                    res.redirect("back");
                    //res.send("You are not authorised");
                }
                
            }
        });
    } else {
        req.flash("error","You need to be Logged in");
        res.redirect("back");
    }
   
};

middlewareObj.isLoggedIn=function(req,res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please login...");
    res.redirect("/login");
};


module.exports= middlewareObj;