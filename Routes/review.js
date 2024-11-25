const express  = require('express');
const router = express.Router({mergeParams : true});
const Listing = require("../modals/listing.js");
const ExpressError = require('../ExpressError.js');
const {listingSchema , reviewSchema} = require('../Schema.js');
const Review =require("../modals/review.js");
const { isLoggedIn, isReviewAuthor } = require('../middleware.js');
const { addReview, deleteReview } = require('../controllers/review.js');
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

router.post("/",validateReview,isLoggedIn,asyncWrap(addReview));
 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,asyncWrap(deleteReview));

 module.exports = router;