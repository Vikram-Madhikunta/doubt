const express = require('express');
const router = express.Router();
const Listing = require("../modals/listing.js");
const { isLoggedIn, isowner } = require('../middleware.js');
const ExpressError = require('../ExpressError.js');
const { listingSchema } = require('../Schema.js');

// Async error wrapper
function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => next(err));
    };
}

// Middleware to validate listing input using Joi
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        return next(new ExpressError(400, errMsg)); // Custom error handler
    }
    next();
};

// Route to get all listings
router.get("/", asyncWrap(async (req, res) => {
    let Alllistings = await Listing.find({});
    if (!Alllistings) {
        console.error("No listings found!");
        return next(new ExpressError(404, "No listings found"));
    }
    res.render("index.ejs", { Alllistings });
}));

// Route to render new listing form
router.get("/new", isLoggedIn, (req, res) => {
    res.render("add.ejs");
});

// Route to get listing by ID
router.get("/:id", asyncWrap(async (req, res, next) => {
    const { id } = req.params;
    const data = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!data) {
        console.error(`Listing with ID ${id} not found`);
        return next(new ExpressError(404, "Could not find this listing"));
    }

    res.render("show.ejs", { data });
}));

// Route to create a new listing
router.post("/", isLoggedIn, validateListing, asyncWrap(async (req, res) => {
    const { title, description, image, price, country, location } = req.body;
    const newListing = new Listing({ title, description, image, price, country, location });
    newListing.owner = req.user._id;

    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));

// Route to edit a listing
router.get("/:id/edit", isLoggedIn, isowner, asyncWrap(async (req, res, next) => {
    const { id } = req.params;
    const data = await Listing.findById(id);

    if (!data) {
        console.error(`Listing with ID ${id} not found for editing`);
        return next(new ExpressError(404, "Could not find this listing"));
    }

    res.render("edit.ejs", { data });
}));

// Route to update a listing
router.put("/:id", isLoggedIn, isowner, validateListing, asyncWrap(async (req, res) => {
    const { title, description, image, price, country, location } = req.body;
    const { id } = req.params;

    const updatedListing = await Listing.findByIdAndUpdate(id, { title, description, image, price, country, location });

    if (!updatedListing) {
        console.error(`Failed to update listing with ID ${id}`);
        return next(new ExpressError(404, "Could not update this listing"));
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}));

// Route to delete a listing
router.delete("/:id", isLoggedIn, isowner, asyncWrap(async (req, res, next) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
        console.error(`Failed to delete listing with ID ${id}`);
        return next(new ExpressError(404, "Could not delete this listing"));
    }

    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}));

module.exports = router;