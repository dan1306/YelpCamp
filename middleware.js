const { CampgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

let logOut =  (req, res, next) => {
    req.logout(req.user, err => {
        if(err) return next(err);
       
         
    });
    next()
}

let isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "you must be signed in!")
        return res.redirect('/login')
    }
    next()
}

const validateCampground = (req, res, next) => {
    const { error } = CampgroundSchema.validate(req.body);
  
    if (error) {
      console.log(error);
      const msg = error.details.map((val) => val.message);
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  
const isAuthor = async (req, res, next) => {
    const findCampground = await Campground.findById(req.params.id)
    if (findCampground.author != req.user.id || !req.user) {
        req.flash("error", "You do not have permission to do that")
       return res.redirect(`/campgrounds/${req.params.id}`)
    }
    next()
}

const isReviewAuthor = async (req, res, next) => {
    const findReview = await Review.findById(req.params.reviewId)
    if (findReview.author != req.user.id || !req.user) {
        req.flash("error", "You do not have permission to do that")
       return res.redirect(`/campgrounds/${req.params.id}`)
    }
    next()
}

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

module.exports= {
    isLoggedIn,
    logOut,
    validateCampground,
    isAuthor,
    validateReview,
    isReviewAuthor
}
    