var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment= require("./models/comment");

var data = [
        {name: "Salmon Creek",
            image:"https://farm2.staticflickr.com/1166/1359158410_46d778223f.jpg",
            description:"Campground1"},
        {name: "Granite Hill",
            image:"https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104496f7c878a6ebb4bf_340.jpg",
            description:"Campground3"  
        },
        {name: "Mountain Goat's Rest",
            image:"https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg",
            description:"Campground3"
        }
        ]

function seedDB(){
    Campground.remove({}, function(err){
        if(err){
            console.log(err);}
        else {
            console.log("Campgrounds Removed")
        };
        
         //add campgrounds
    
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err); 
                } else {
                    console.log(campground);
                    Comment.create({
                        text: "This place is great, but I wish there was Internet",
                        author: "Homer"
                    }, function(err, comment){
                        
                            if(err){
                                console.log(err);
                            } else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("comment created");
                            }
                    });
                }
            
            });
        });
    
    });
    
 
}

module.exports=seedDB;