var mongoose = require ("mongoose").set('debug', true);
mongoose.connect('mongodb://localhost:27017/cat_app', { useNewUrlParser: true });
 
var catSchema = new mongoose.Schema(
{ name: String,    
  age: Number,
  temperament: String});
 
var Cat = mongoose.model("Cat", catSchema);
 
Cat.create ();// add new cat to databse
 
var george = new Cat({    name: "George",    age: 11,    temperament: "Cute"});
george.save(function (err, catSaved)
{ if (err){       
    console.log("Something went wrong" +  err);    
}  else {        
    console.log("We have a cat");        
    console.log(catSaved);
}});