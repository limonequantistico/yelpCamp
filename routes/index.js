//Express Router
var express = require("express");
var router = express.Router();

var passport = require("passport");
var User = require("../models/user");

router.get("/", function (req, res) {
    res.render("landing.ejs");
});

//AUTH ROUTES
//Show register form
router.get("/register", function (req, res) {
    res.render("register.ejs");
});
//Handle sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        } else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome to YelpCamp " + user.username + "! :)");
                res.redirect("/campgrounds");
            });
        }
    });
});

//Login form
router.get("/login", function (req, res) {
    res.render("login.ejs");
});
//Login logic(route)
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {
    //
});

//logout route
router.get("/logout", function (req, res) {
    req.logOut();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;