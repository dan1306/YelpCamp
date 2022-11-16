const express = require('express')
const router = express.Router({mergeParams: true})
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const Campground = require("../models/campground");
const {  reviewSchema } = require("../schemas");
const Joi = require("joi");


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
  
    if (error) {
      console.log(error);
      const msg = error.details.map((val) => val.message);
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
};
  

router.post(
    "/",
    validateReview,
    catchAsync(async (req, res) => {
        console.log(req.body);
        const {
            id
        } = req.params;
        let campground = await Campground.findById(id);
        const review = new Review(req.body);
        campground.reviews.push(review._id);
        await review.save();
        await campground.save();
        req.flash("success", "Successfully created New Review")
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete(
    "/:reviewId",
    catchAsync(async (req, res, nect) => {
        const {
            id,
            reviewId
        } = req.params;

        await Campground.findByIdAndUpdate(id, {
            $pull: {
                reviews: reviewId
            }
        });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Successfully Deleted a Review")

        res.redirect("/campgrounds/" + id);
    })
);


module.exports = router