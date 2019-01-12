// VERSION 13.1  Add hamburger to Navbar and show page menu /-Collapsible comment section

var express             = require("express"),
    app                 = express(),
    mongoose            = require("mongoose"), //require mongoose
    flash               = require("connect-flash"),
    bodyParser          = require("body-parser"), //to obtain data from the body
    request             = require("request"),
    campGround          = require("./models/campgrounds"),
    seedDB              = require("./seeds"),
    passport            = require("passport"),
    localStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),
    User                = require("./models/user"),
    reqComments         = require("./models/comments");

//Require the route files
var authRoutes      = require("./routes/auth"),
    commentRoutes   = require("./routes/comments"),
    campGroundRoutes= require("./routes/campgrounds");

   
//Connect to the Campgrounds database
// mongoose.connect("mongodb://localhost:27017/yelp_camp_v13", { useNewUrlParser: true }); //connect to DB if exists if not creates it and connects to it.
mongoose.connect("mongodb://admin:techsiteweb1@ds155614.mlab.com:55614/yelpcamptsw", { useNewUrlParser: true }); //connect to DB if exists if not creates it and connects to it.
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

//Tell express to use required packages
app.use(bodyParser.urlencoded({extended: true})); //tell express to use the bodyParser
app.set("view engine", "ejs"); // tell express to use ejs files
app.use(express.static(__dirname + "/public")); //secure the current path to the file, in case the path changes
app.use(methodOverride("_method")); // tell express to use method-override under _mehthod

app.use(flash()); // tell express to use connect-flash / this line should be before passport config

//Require Moment and add it to app.locals to make it available for use in all of your view files via the variable named moment
app.locals.moment   = require("moment");

//Configure passport
app.use(require("express-session")({
    secret: "Cultivo una Rosa Blanca",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Tell all the local templates of the currentUser status (loggedin or not)
//Tell all the templages to use a flash message if needed (error or success message)
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); //very important to add this line to make sure the code executes the next part of the function
});


//Tell express to use the required route files
app.use("/", authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/", campGroundRoutes);

//Have express listen on the provided PORT/IP
app.listen(process.env.PORT, process.env || 3000, function(){
    console.log("Yelp Camp Server Has Started!!!");
});

