const express = require('express');
const router = express.Router();
const Listing = require("../modals/listing.js");
const { isLoggedIn, isowner } = require('../middleware.js');
const ExpressError = require('../ExpressError.js');
const { listingSchema } = require('../Schema.js');
const { index, renderNewform, showlistings, addListing, editListingForm, updateListing, deleteListings } = require('../controllers/listing.js');
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});

require('dotenv').config();
// Async error wrapper
function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => next(err));
    };
}

// Middleware to validate listing input using Joi
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate({listings:req.body});
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        return next(new ExpressError(400, errMsg)); // Custom error handler
    }
    next();
};

// Route to get all listings
router.route("/")
      .get(asyncWrap(index))
      .post(isLoggedIn,upload.single('image'),asyncWrap(addListing));


router.get("/new", isLoggedIn,renderNewform);
// Route to get listing by ID
router.get("/:id", asyncWrap(showlistings));



// Route to edit a listing
router.get("/:id/edit", isLoggedIn, isowner, asyncWrap(editListingForm));

// Route to update a listing
router.route("/:id")
    .put(isLoggedIn, isowner, validateListing, asyncWrap(updateListing))
    .delete(isLoggedIn, isowner, asyncWrap(deleteListings));

// Route to delete a listing

module.exports = router;
