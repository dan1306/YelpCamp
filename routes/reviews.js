const express = require('express')
const router = express.Router({mergeParams: true})
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const Campground = require("../models/campground");
const {  reviewSchema } = require("../schemas");
const Joi = require("joi");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware")
const reviewCtr = require("../controllers/reviews")

// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
  
//     if (error) {
//       console.log(error);
//       const msg = error.details.map((val) => val.message);
//       throw new ExpressError(msg, 400);
//     } else {
//       next();
//     }
// };
  

router.post(
    "/",
    isLoggedIn,
    validateReview,
    catchAsync(reviewCtr.pstReview)
);

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    catchAsync(reviewCtr.deleReview)
);


module.exports = router