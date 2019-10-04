var mongoose = require("mongoose");

//SCHEMA
var campGroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
var Campground = mongoose.model("Campground", campGroundSchema);

//Questo e' cio' che viene passato
module.exports = Campground;