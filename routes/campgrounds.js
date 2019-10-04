//Express Router
var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var middleware = require("../middleware/index");//Non serve index perche' lo cerca automaticamente

router.get("/campgrounds", function (req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index.ejs", {campgrounds: allCampgrounds, currentUser: req.user});//Passiamo anche l'utente per la logica della navbar
        }
    });
});

router.post("/campgrounds", middleware.isLoggedIn, function (req, res) {//essendo una post possiamo usare lo stesso URL
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var descr = req.body.description;
    var author = {
        id: req.user._id,//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<is .-. ._. .-.
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: descr, author: author};
    //Create a new campground and save to DB
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

router.get("/campgrounds/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new.ejs")
});

router.get("/campgrounds/:id", function (req, res) {//Se la mettessimo sopra a /new anche quello verrebbe preso come id
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("campgrounds/show.ejs", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit.ejs", {campground: foundCampground});
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function (req, res) {
    //find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, {useFindAndModify: false}, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    //redirect to show page

});

//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, {useFindAndModify: false}, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;