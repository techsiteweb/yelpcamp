var mongoose = require("mongoose");

//Tell mongoose the model structure of the collection (SCHEMA setup)
var commentsSchema = new mongoose.Schema({
        text: String,
        createdAt: { type: Date, default: Date.now },
        author: {
          id: {
              type:mongoose.Schema.Types.ObjectId,
              ref: "user"      
        },
        username: String,
        }
}); 

//Export the model
module.exports = mongoose.model("comment", commentsSchema);