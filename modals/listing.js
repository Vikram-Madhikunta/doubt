
const mongoose = require('mongoose');
const review = require('./review.js');


const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
       url:String,
       filename :String
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
    owner : 
        {
            type : mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
})


listingSchema.post("findOneAndDelete", async (listings)=>{
    if(listings){
        await Review.deleteMany({_id : {$in : listings.reviews}});
    }
})

const Listings = new mongoose.model("Listings",listingSchema);

module.exports = Listings;