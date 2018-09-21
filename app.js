// npm init
// npm install express ejs --save
// mkdir partials and add header & footer partials
// <% include partials/header> and footer in the landing page
// npm install body-parser --save
// npm install mongoose --save

var express = require("express");
var app = express();
var Campground= require("./models/campground");
var seedDB = require("./seeds");

// body parser include

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

//connecting to DB
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});


seedDB();
 /*Campground.create({
    name: "Granite Hill", 
    image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104496f3c070a4e5b4b9_340.jpg",
    description: "This is a beautiful Granite Mountain"
    },function(err, campground){
        if(err){
            console.log(err);
        } else {
            console.log("New Campground Created");
            console.log(campground);
            
       }
    }); */

/* var campgrounds = [
        {name: "Salmon Creek", image:"https://farm2.staticflickr.com/1166/1359158410_46d778223f.jpg"},
        {name: "Granite Hill", image:"https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104496f2c87aa0eeb4be_340.jpg"},
        {name: "Mountain Goat's Rest", image:"https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104496f2c87aa0eeb4be_340.jpg"}
        ]*/

app.get("/", function(req, res){
      res.render("landing");
});

app.get("/campgrounds", function(req,res){
     //retrieve campgrounds fromm DB
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                res.render("index", {campgrounds: allCampgrounds});
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
    res.render("new");
});

app.get("/campgrounds/:id", function(req, res){
    
    Campground.findById(req.params.id, function(err, foundCampground){
        
        if(err){
            console.log("error");
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
        
});
    


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp Camp Server Started.....")
});