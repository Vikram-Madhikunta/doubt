const Listing = require('./modals/listing.js');
const Review = require('./modals/review.js');
module.exports.isLoggedIn= (req,res,next)=>{
    // console.log(req.path );
    // console.log(req.originalUrl );
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isowner= async(req,res,next)=>{
    let {id}=req.params;
    let currListing= await Listing.findById(id);
    if(!currListing.owner.equals(res.locals.currUser._id)){
        req.flash("error","Access Denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isReviewAuthor= async(req,res,next)=>{
    let {id, reviewId}= req.params;
    let currReview=await Review.findById(reviewId);
    if(!currReview.author.equals(res.locals.currUser._id)){
        req.flash("error","Access Denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
}