/** mongoose is a js odm - object data mapper */

console.log("started");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat_app");

console.log("connected");
var catSchema = new mongoose.Schema({
  name: String,
  age: Number,
  temperament: String
});
console.log("schema created");
var Cat = mongoose.model("Cat", catSchema); //collection -cats(plural)
console.log("model created");
/* 
var george = new Cat({
  name: "Norris",
  age: 7,
  temperament: "Grouchy"
});
console.log("george created"); 

george.save(function(err, cat) {                                    //save
  if (err) {
    console.log("Something went wrong..cat not added");
  } else {
    console.log("cat saved");
    console.log(cat);
  }
});*/

/*
CREATE and SAVE SINGLE step
*/

Cat.create(
  {
    name: "snow",
    age: 11,
    temperament: "nice"
  },
  function(err, cat) {
    if (err) {
      console.log(err);
    } else {
      console.log("cat added");
      console.log(cat);
    }
  }
);

Cat.find({}, function(err, cats) {
  //all cats
  if (err) {
    console.log("error");
  } else {
    console.log("all cats");
    console.log(cats);
  }
});
/*
Cat.find({ name: "Norris" }, function(err, cats) {
  if (err) {
    console.log("error");
  } else {
    console.log("cats with name Norris"); //special cat
    console.log(cats);
  }
});
*/
console.log("end");
