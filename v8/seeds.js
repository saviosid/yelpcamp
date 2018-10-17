var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment= require("./models/comment");

var data = [
        {name: "Salmon Creek",
            image:"https://farm2.staticflickr.com/1166/1359158410_46d778223f.jpg",
            description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
        },
        {name: "Hailey Idaho",
            image:"https://tse1.mm.bing.net/th?id=OIP.57Of0lLd0WUZYe5L9vhScwHaFj&w=151&h=105&c=8&rs=1&qlt=90&dpr=1.125&pid=3.1&rm=2",
            description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)." 
        },
        {name: "Mountain Goat's Rest",
            image:"https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg",
            description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
        },
        {name: "Milwaukee",
            image:"https://tse1.mm.bing.net/th?id=OIP.Ww32HNgatE5NLs71-1l7VAHaFj&w=151&h=105&c=8&rs=1&qlt=90&dpr=1.125&pid=3.1&rm=2",
            description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
        }
        
        ]

function seedDB(){
    Campground.remove({}, function(err){
        if(err){
            console.log(err);}
        else {
            console.log("Campgrounds Removed");
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