// npm init
// npm install express ejs --save
// mkdir partials and add header & footer partials
// <% include partials/header> and footer in the landing page
// npm install body-parser --save
// npm install mongoose --save

var express         = require("express");
var app             = express();
var Campground      = require("./models/campground");
var seedDB          = require("./seeds");
var Comment         = require("./models/comment");
var passport        = require("passport");
var LocalStrategy   = require("passport-local");
var User            = require("./models/user")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));

//connecting to DB
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});

seedDB();


//Passport Configuration
    app.use(require("express-session")({
        secret: "Just Testing",
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    // middleware to pass currentUser to all routes
    app.use(function(req, res, next){
        res.locals.currentUser = req.user;
        next();
    });


//================
//  Routes
//================

app.get("/", function(req, res){
      res.render("landing");
});

app.get("/campgrounds", function(req,res){
     //retrieve campgrounds fromm DB
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
            }
        });
});

app.post("/campgrounds", function(req, res){
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

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res){
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        
        if(err){
            console.log("error");
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
        
});

//===================
// Comment Routes
//===================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    
    // find campground
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log("error finding campground");}
        else {
                res.render("comments/new", {campground: campground});
        }
        
    });
   
});
    
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    
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

//================
// Auth Routes
//================

// Show Register Form
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
 // req.body.username;
 // req.body.password;
 var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
      if(err){
          console.log("error");
          res.render("register");
      }
      passport.authenticate("local")(req, res, function(){
          res.redirect("/campgrounds");
      });
  });
});

app.get("/login", function( req, res){
    res.render("login");
});


app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
    
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});


function isLoggedIn(req,res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};
 


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp Camp Server Started.....")
});