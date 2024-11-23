const Listing = require("../modals/listing.js");


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

    res.render("show.ejs", { data });
}

module.exports.addListing = async (req, res) => {
    const { title, description, image, price, country, location } = req.body;
    const newListing = new Listing({ title, description, image, price, country, location });
    newListing.owner = req.user._id;

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

module.exports.updateListing = async (req, res) => {
    const { title, description, image, price, country, location } = req.body;
    const { id } = req.params;

    const updatedListing = await Listing.findByIdAndUpdate(id, { title, description, image, price, country, location });

    if (!updatedListing) {
        console.error(`Failed to update listing with ID ${id}`);
        return next(new ExpressError(404, "Could not update this listing"));
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

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