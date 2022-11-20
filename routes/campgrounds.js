const express = require('express')
const router = express.Router()
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { CampgroundSchema } = require("../schemas");
const Joi = require("joi");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware")
const campgroundCtrl = require("../controllers/campgrounds")
const multer = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({ storage })


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
    upload.array('image'),
    validateCampground,
    catchAsync(campgroundCtrl.pstNewCampground)
);

// router.post(
//     "/new", upload.array('image'), (req, res) => {
//         console.log(req.body, req.files)
//         res.send("it worked")
//     }
// );

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
    upload.array('image'),
    validateCampground,
    catchAsync(campgroundCtrl.putEdit)
);

router.delete(
    "/:id",
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundCtrl.deleCampground)
);


module.exports = router