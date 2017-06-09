var mongoose = require("mongoose");
var passportLocal = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    // comments: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Comment"
    // }]
});

userSchema.plugin(passportLocal);

module.exports = mongoose.model("User", userSchema);