const Review = require("../models/review");
const Campground = require("../models/campground");


let pstReview = async (req, res) => {
    console.log(req.body);
    const {
        id
    } = req.params;
    let campground = await Campground.findById(id);
    const review = new Review(req.body);
    campground.reviews.push(review._id);
    review.author = req.user.id;
    await review.save();
    await campground.save();
    req.flash("success", "Successfully created New Review")
    res.redirect(`/campgrounds/${campground._id}`);
}

let deleReview = async (req, res, nect) => {
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
}


module.exports = {
    pstReview,
    deleReview
}