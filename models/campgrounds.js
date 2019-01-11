var mongoose = require("mongoose");

//Tell mongoose the model structure of the collection (SCHEMA setup)
var campgroundsSchema = new mongoose.Schema({
        name: String,
        image: String,
        price: String,
        description: String,
        createdAt: { type: Date, default: Date.now },
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            username: String
        },
        comments: [
                {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: "comment"
                }
        ]
});

//Export the model
module.exports = mongoose.model("campGround", campgroundsSchema);