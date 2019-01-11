var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");


//Create the user schema
var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

//Plug in passportLocalMongoose to the UserSchema
//-passportLocalMongoose takes over and starts adding method to our users
UserSchema.plugin(passportLocalMongoose);

//Export the UserSchema as "User"
module.exports = mongoose.model("User", UserSchema);
    
