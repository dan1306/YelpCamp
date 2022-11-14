const Joi = require("joi");

module.exports.CampgroundSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required(),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
});
  
module.exports.reviewSchema = Joi.object({
    rating: Joi.number().min(0).max(5).required(),
    body: Joi.string().min(1).required()
})