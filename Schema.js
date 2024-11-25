const Joi = require('joi');
const review = require('./modals/review');
const listings = require('./modals/listing');


module.exports.listingSchema = Joi.object({
    listings : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        // image : Joi.string().allow("",null),
        price : Joi.number().required().min(0),
        location : Joi.string().required(),
        country : Joi.string().required(),
    }).required(),
});

module.exports.reviewSchema  = Joi.object({
        review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
        createdAt: Joi.date().allow("",null),
    }).required(),
})