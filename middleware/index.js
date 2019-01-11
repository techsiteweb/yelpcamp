//All the middleware was here
//Require the campgrounds and comments models into this file
var campGround  = require("../models/campgrounds"),
    reqComments = require("../models/comments");
//Create an object
var middlewareObj = {};

//Check camp ownership and protect the edit/update/delete routes
middlewareObj.checkCampOwnership = function(req, res, next){
    //is the user logged in
    if(req.isAuthenticated()){
        campGround.findById(req.params.id, function(err, foundCampGround){
        if(err || !foundCampGround){
            req.flash("error", "CampGround not found!");
            res.redirect("back");
    } else {
        //is the user the camp's author
        if(foundCampGround.author.id.equals(req.user._id)){
            next();
            } else {
                res.flash("error", "Not allowed to edit. You are not the creator of: " + foundCampGround.name);
                res.redirect("back");
            }
         }
        });
    } else {
    
        res.redirect("back");
    }
};


//Middleware function to check camp ownership and protect the edit/update/delete routes
middlewareObj.checkCommentOwnership = function(req, res, next){
    //is the user logged in
    if(req.isAuthenticated()){
        reqComments.findById(req.params.comment_id, function(err, foundComment){
        if(err || !foundComment){
            req.flash("error", "Comment not found");
            res.redirect("back");
    } else {
        //is the user the comment's author
        if(foundComment.author.id.equals(req.user._id)){ //the logged in user is store in req.user thanks to passport
            next();
            } else {
                res.flash("error", "Not allowed to edit. You are not the author of: " + foundComment.name);
                res.redirect("back");
            }
         }
        });
    } else {
    
        res.redirect("back");
    }
};


//Middleware function  isLoggedIn to place inside the /campgrounds route
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be signed in to continue!");
    res.redirect("/login");
};


module.exports = middlewareObj;