module.exports.addReview = async(req,res)=>{
    let listings = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review); 
    newreview.author = req.user;
    console.log(newreview);
    await newreview.save();
    listings.reviews.push(newreview);
    
    await listings.save();
    res.redirect(`/listings/${listings._id}`);
 };


module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    console.log(id+","+reviewId);
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}