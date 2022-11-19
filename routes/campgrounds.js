const express = require('express')
const router = express.Router()
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { CampgroundSchema } = require("../schemas");
const Joi = require("joi");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware")
const campgroundCtrl = require("../controllers/campgrounds")



// const validateCampground = (req, res, next) => {
//     const { error } = CampgroundSchema.validate(req.body);
  
//     if (error) {
//       console.log(error);
//       const msg = error.details.map((val) => val.message);
//       throw new ExpressError(msg, 400);
//     } else {
//       next();
//     }
//   };
  
// const isAuthor = async (req, res, next) => {
//     const findCampground = await Campground.findById(req.params.id)
//     if (findCampground.author != req.user.id || !req.user) {
//         req.flash("error", "You do not have permission to do that")
//        return res.redirect(`/campgrounds/${req.params.id}`)
//     }
//     next()
// }


router.get(
    "/",
    catchAsync(campgroundCtrl.index)
);

router.get("/new", isLoggedIn, campgroundCtrl.newCampground);

router.post(
    "/new",
    isLoggedIn,
    validateCampground,
    catchAsync(campgroundCtrl.pstNewCampground)
);

router.get(
    "/:id",
    catchAsync(campgroundCtrl.showCampground)
);

// router.get(
//     "/makeCampGround",
//     catchAsync(async (req, res) => {
//         const camp = new Campground({
//             title: "daniel",
//         });
//         await camp.save();
//         res.send("camp");
//     })
// );

router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundCtrl.getEdit)
);

router.put(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundCtrl.putEdit)
);

router.delete(
    "/:id",
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundCtrl.deleCampground)
);


module.exports = router