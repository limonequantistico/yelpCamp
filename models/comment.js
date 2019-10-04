var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    author: { //Questo ci permette di togliere l'input "autore" nei commenti e prenderlo automaticamente
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);