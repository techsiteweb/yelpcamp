//Require express and create instance of express.Router()
var express = require("express"),
    router  = express.Router({mergeParams: true});    

//Require the models
var campGround      = require("../models/campgrounds"),
    reqComments     = require("../models/comments"),
    middleware   = require("../middleware");

//=================
//COMMENTS ROUTES
//=================
//here we find the campground in the new comment route and pass it on
router.get("/new", middleware.isLoggedIn,  function(req, res) {
    //find the campgrounds by id so you pass it on
    campGround.findById(req.params.id, function(err, foundCampGround){
        if(err){
            console.log(err);
        } else {
            //here we are passing the found campground so we can associate with the new comment
            res.render("comments/new", {foundCampGround: foundCampGround});
        }
    });
});

//here in the create route we submit the new comment already associated with the found 
//campgrounds sent form the new route
router.post("/", middleware.isLoggedIn, function(req, res){ 
    //lookup the campgound by ID
    campGround.findById(req.params.id, function(err, foundCampGround){ //this only run if a user is logged in, so we have a user id
        if(err){
            console.log(err);
        } else {
            //create the comment from the comments model required up top
            reqComments.create(req.body.comment, function(err, createdcomment){
                if(err){
                    res.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //here we add the author's username and id to the comments author attributes, before we add them to comments
                    createdcomment.author.id = req.user._id;
                    createdcomment.author.username = req.user.username;
                    //save the createdcomment
                    createdcomment.save();
                    //push the comments into the comments attribute of the campground model (associate the comment to the campground)
                    foundCampGround.comments.push(createdcomment);
                    //save the campground with the new comment to the database
                    foundCampGround.save();
                    //then redirect to the show campground page of the ID'd campground
                    res.redirect("/campgrounds/" + foundCampGround._id);
                }
            });
        }
    });
});

//Edit comments route : /campgrounds/:id/comments/:comment_id/edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    campGround.findById(req.params.id, function(err, foundCampGround){
        if(err || !foundCampGround){
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        reqComments.findById(req.params.comment_id, function (err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id: req.params.id, foundComment: foundComment});
            }
        });
    });
});

//UPDATE comments route : /campgrounds/:id/comments/:comment_id
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    reqComments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else { //redirect to show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY comments route: /campgrounds/:id/comments/:comment_id
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    reqComments.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }  else { //redirect to show camp page (camp obtained by: req.params.id)
            req.flash("success", "Successfully deleted comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;