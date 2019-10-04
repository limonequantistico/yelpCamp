var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
var User = require("./models/user.js");
var seedDB = require("./seeds.js");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelpcamp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Rusty is a motherfucker",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Per usare la variabile "currentUser" senza doverla aggiungere manualmente a tutte le routes
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);  //app.use("/campgrounds",campgroundRoutes); -> Se usi questa forma nel file devi togliere tutti i collegamenti a /campgrounds
app.use(commentRoutes);     //app.use("/campgrounds/:id/comments",commentRoutes); -> assicurati di aggiungere dentro comments.js -> var router = express.Router({mergeParams: true});

app.listen(3000, function () {
    console.log("Connected to YelpCamp Project");
});
