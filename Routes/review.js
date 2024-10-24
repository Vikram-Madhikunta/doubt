const express  = require('express');
const router = express.Router({mergeParams : true});
const Listing = require("../modals/listing.js");
const ExpressError = require('../ExpressError.js');
const {listingSchema , reviewSchema} = require('../Schema.js');
const Review =require("../modals/review.js");
const { isLoggedIn, isReviewAuthor } = require('../middleware.js');
function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err) => next(err))
    }
}


const validateReview = (req,res,next)=>{
    console.log(req.body);
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

router.post("/",validateReview,isLoggedIn,isReviewAuthor,asyncWrap( async(req,res)=>{
    let listings = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review); 
    newreview.author = req.user._id;
    console.log(newreview);
    await newreview.save();
    listings.reviews.push(newreview);
    
    await listings.save();
    res.redirect(`/listings/${listings._id}`);
 }));
 
 router.delete("/:reviewId",isLoggedIn,isReviewAuthor,asyncWrap( async(req,res)=>{
     let {id,reviewId} = req.params;
     console.log(id+","+reviewId);
     await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}})
     await Review.findByIdAndDelete(reviewId);
     res.redirect(`/listings/${id}`);
 }));

 module.exports = router;