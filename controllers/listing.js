const Listing = require("../modals/listing.js");
const ExpressError = require("../ExpressError.js"); 
require("dotenv").config();

module.exports.index = async (req, res) => {
    let Alllistings = await Listing.find({});
    if (!Alllistings) {
        console.error("No listings found!");
        return next(new ExpressError(404, "No listings found"));
    }
    // console.log(Alllistings);
    res.render("index.ejs", { Alllistings });
}


module.exports.renderNewform =  (req, res) => {
    res.render("add.ejs");
}


module.exports.showlistings = async (req, res, next) => {
    const { id } = req.params;
    const data = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!data) {
        console.error(`Listing with ID ${id} not found`);
        return next(new ExpressError(404, "Could not find this listing"));
    }


    res.render("show.ejs", { data ,   mapToken: process.env.MAP_TOKEN });
}

module.exports.addListing = async (req, res) => {
    let url = req.file.url;
    let filename = req.file.filename;
    const { title, description, image, price, country, location } = req.body;
    const newListing = new Listing({ title, description, price, country, location });
    newListing.owner = req.user._id;
    newListing.image = {url,filename};

    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}


module.exports.editListingForm  = async (req, res, next) => {
    const { id } = req.params;
    const data = await Listing.findById(id);
   

    if (!data) {
        console.error(`Listing with ID ${id} not found for editing`);
        return next(new ExpressError(404, "Could not find this listing"));
    }

    res.render("edit.ejs", { data });
}

// Ensure this is properly imported

module.exports.updateListing = async (req, res, next) => {
    const { title, description, price, country, location } = req.body;
    const { id } = req.params;

    try {
        // Find and update the listing
        const updatedData = { title, description, price, country, location };
        if (req.file) {
            updatedData.image = {
                url: req.file.url,
                filename: req.file.filename,
            };
        }

        const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, {
            new: true, // Return the updated document
            runValidators: true, // Ensure schema validators are applied
        });

        if (!updatedListing) {
            console.error(`Failed to update listing with ID ${id}`);
            throw new ExpressError(404, "Listing not found");
        }

        req.flash("success", "Listing Updated");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error(`Error updating listing: ${error.message}`);
        next(error);
    }
};

module.exports.deleteListings = async (req, res, next) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
        console.error(`Failed to delete listing with ID ${id}`);
        return next(new ExpressError(404, "Could not delete this listing"));
    }

    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}