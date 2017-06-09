var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

// var campgrounds = [
//         {name: "Campbell", image: "http://cranbrooktourism.ca/wp-content/uploads/sites/190/2014/07/Dollarphotoclub_40751189-1024x681.jpg", description:"pilot"}, 
//         {name: "Hill Creek", image: "http://www.big-sur-lodging.com/Big-Sur-California-Visitor-Guide/Outdoor-Activities/Coast-Campgrounds-Photos/Ventana_Campground_Campsite_Campers-6-1024x647.jpg", description:"pilot"},
//         {name: "KOA", image: "https://myopencountry.com/wp-content/uploads/2017/04/Depositphotos_82889290_original-1024x683.jpg", description:"pilot"}
//         ];
        

function seedDB(){
Campground.remove({}, function(err, body){
    if(err)
    {
        console.log(err);
    }
    else{
        console.log("campgrounds remoced!!");
        // campgrounds.forEach(function(camp){
        //   Campground.create(camp, function(err, newCampground){
        //       if(err)
        //       {
        //           console.log(err);
        //       }
        //       else
        //       {
        //           console.log("campground created");
        //       }
        //   }) ;
        // });
    }
});
}

module.exports= seedDB;

