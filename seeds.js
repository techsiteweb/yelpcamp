var mongoose = require("mongoose");
var campGrounds = require("./models/campgrounds");
var comments = require("./models/comments");


//Sample data too be added to DB in this case an array
//Campground data (OBJECTS) inside an array
var data = [
    {
     name: "Aquilae", 
     image: "https://www.kcet.org/sites/kl/files/atoms/article_atoms/www.kcet.org/socal/socal_wanderer/assets_c/2012/05/nate2b-thumb-597x398-28851.jpg",
     description: "Aquila constellation is sometimes associated with the eagle that held Zeus’ thunderbolts in Greek mythology and other times with the eagle that abducted Ganymede and brought him to Olympus."
    },
    {
     name: "Boötis", 
     image: "https://www.geico.com/more/wp-content/uploads/GEICOMore_GreatCampgroundsForFall_Hero_RF_524369387_600x400.jpg",
     description: "Boötes is one of the ancient Greek constellations. The constellation’s name means “the oxen-driver” and Boötes is usually identified as the ploughman who drove the oxen represented by Ursa Major."
    },
    {
     name: "Camelopardalis", 
     image: "https://images.pexels.com/photos/1252399/pexels-photo-1252399.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
     description: "The Latin word camelopardalis means “the giraffe,” and is a combination of the Greek words for the camel and the leopard. The Greeks came up with the name because the giraffe reminded them of the camel because of its long neck, and had spots like a leopard."
    },
    {
     name: "Carinae", 
     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZzhWXNE4FP9EZ3m6BsE2ms_sSDdtxc8H_SnBnX7z7DAs4-feS",
     description: "Carina was one of the three constellations that formed Argo Navis, a large constellation that represented the ship on which Jason and the Argonauts sailed to Colchis to get the Golden Fleece."
    },
    {
     name: "Draconis", 
     image: "http://mammothrv.com/Images/winter-rv-camping-mammoth-lakes.jpg",
     description: "Draco constellation represents the dragon Ladon, the mythical creature with a hundred heads that guarded the gardens of the Hesperides in Greek mythology. Heracles killed the dragon with his poisoned arrows as part of his Twelve Labours"
    },
    {
     name: "Ophiuchi", 
     image: "https://images.pexels.com/photos/965153/pexels-photo-965153.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
     description: "Ophiuchus is another Greek constellation. It represents Asclepius, the famous healer in Greek mythology, and is usually depicted as a man holding a serpent, represented by the constellation Serpens"
    },
 ];

//Create function to delete all the content of the DB and re-add them 
function seedDB(){
    campGrounds.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("CampGrounds Removed!");
        //Inside this callback function add campGrounds to database:(create)
        data.forEach(function(seed){ //seed is the object obtained from the array "data"
            campGrounds.create(seed, function(err, addedCamp){
                if(err){
                    console.log(err);
                } else {
                    console.log(("CampGrounds Added!"));
                    //Inside this call back add the comments (manually this time)
                    comments.create(
                        {
                            text: "I like it, but I wish there was internet!",
                            author: "Chenguelia"
                        }, function(err, createdComment){
                            if(err){
                                console.log(err);
                            } else { //Here we associate the comments with the campgrounds
                               addedCamp.comments.push(createdComment);
                               addedCamp.save();
                               console.log("Comments associated with Camps");
                            }
                        });
                }
            });
        });
    });
}

//Export the function
module.exports = seedDB;
 
// campGround.create({
//     name: "Camp1", 
//     image: "https://images.pexels.com/photos/1252399/pexels-photo-1252399.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
// }, function(err, campGround){
//     if(err){
//         console.log("Something is MESSED UP!!!");
//     }else{
//         console.log("Everything is fine, campGround added!!!");
//         console.log(campGround);
//     }
// });
    
// //Add this array to a database
// for(var i = 0; i < mycampGrounds.length; i++){
//     campGround.create(mycampGrounds[i], function(err, campGround){
//         if(err){
//             console.log("Something was not added");
//             console.log(err);
//         }else{
//             console.log("Items added to DB!!!");
//         }
//     });
    
// }
