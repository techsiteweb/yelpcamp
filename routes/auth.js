//Require express and create instance of express.Router()
var express = require("express"),
    router  = express.Router();         

//Require other dependencies (passport, the User model)
var passport    = require("passport"),
    User        = require("../models/user");

//Create landing page route
router.get("/", function(req, res){
    res.render("landing");
});

//show register form
router.get("/register", function(req, res) {
    res.render("register");
});

//this route will handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, newUser){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + newUser.username + "!");
            res.redirect("/campgrounds");
        });
    });
});


//Show Login form route
router.get("/login", function(req, res){
    res.render("login");
});

//Handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
    }), function(req, res){
});

//Logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You have successfully logged out!");
    res.redirect("/campgrounds");
});


module.exports = router;