//Require express and create router (an instance of express.Router())
var express         = require("express"),
    router          = express.Router(), 
    middleware      = require("../middleware");

//Require the models 
var campGround = require("../models/campgrounds");

//=================
//CAMPGROUND ROUTES
//=================
//This is RESTfull INDEX route (Show all the camps)
router.get("/",  function(req, res){
    //get data from DB and put it into an array
campGround.find({}, function(err, mycampGrounds){
    if(err){
        console.log(err);
    }else{
        res.render("campgrounds/index", {campGroundsVar: mycampGrounds}); //Pass the data as an OBJECT to the campgrounds page
    }
    });
});

//CREATE POST route 
//This is the RESTfull CREATE (Adds new camp to DataBase)
router.post("/", middleware.isLoggedIn, function(req, res){
   //get data from form and add to campgrounds array
   var newcamp = req.body.newcamp;
   var newcampimage = req.body.newcampimage;
   var price = req.body.price;
   var desc = req.body.description;
   //here we add an objet (author) that includes the user name and id so we can pass to the new campground
   var author = {
            id: req.user._id,
            username: req.user.username
   };
   var newCampGrounds = {name: newcamp, image: newcampimage, price: price, description: desc, author: author};
   campGround.create(newCampGrounds, function(err, thenewcampgrounds){
       if(err){
           console.log(err);
       }else{
           res.redirect("/campgrounds"); //this redirect has GET route
       }
   });
});

//Create a GET route to add new campgrounds. This date will be sent to the POST route
//This is RESTfull NEW (shows form to enter new camps)
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//REMEMBER ORDER MATTERS IN TERMS OF ROUTES!!!
//Create a GET route to show more info about 1 particular camp
//This is RESTfull SHOW (shows info of 1 camp (id))
router.get("/:id", function(req, res) {
    //Find the camp with the provided ID
    //In order to show the content of comments we need to use .populate("comments").exec(err, function())
    campGround.findById(req.params.id).populate("comments").exec(function(err, foundCampGround){
        if(err || !foundCampGround){
            req.flash("error", "CampGround not found");
            console.log(err);
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {campgrounds: foundCampGround});
        }
    });
    //Render the show more info page
    
});

//EDIT CampGrounds
//Check if the author of the camp is the logged in user
router.get("/:id/edit", middleware.checkCampOwnership, function(req, res){
        campGround.findById(req.params.id, function(err, foundCampGround){
        if(err){
            console.log(err);
            res.flash("error", "CampGround Not Found");
        } else {
            res.render("campgrounds/edit", {foundCampGround: foundCampGround});
        }
    });
});

//UPDATE CampGrounds
router.put("/:id", middleware.checkCampOwnership, function(req, res){
    //find and update the correct campground
    campGround.findByIdAndUpdate(req.params.id, req.body.editcamp, function(err, updatedCampGround){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + updatedCampGround.id);
        }
        
    });
});


//Confirm delete CampGround
router.get("/:id/delete", middleware.checkCampOwnership, function(req, res){
    campGround.findById(req.params.id, function(err, foundCampGround){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/delete", {foundCampGround: foundCampGround});
            console.log(foundCampGround);
        }
    });
});

//DESTROY/DELETE Route
router.delete("/:id", middleware.checkCampOwnership, function(req, res){
    //find and delete the correct campground
    campGround.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;
