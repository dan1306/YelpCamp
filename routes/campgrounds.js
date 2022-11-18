const express = require('express')
const router = express.Router()
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { CampgroundSchema } = require("../schemas");
const Joi = require("joi");
const {isLoggedIn, validateCampground, isAuthor} = require("../middleware")



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
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        
        res.render("campgrounds/index", {
            campgrounds,
        });
    })
);

router.get("/new", isLoggedIn, (req, res) => {
    console.log(req.user.id)
    res.render("campgrounds/new");
});

router.post(
    "/new",
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res, next) => {
        const campground = new Campground(req.body);
        campground.author = req.user._id
        await campground.save();
        req.flash("success", "Successfully made a new Campground")
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.get(
    "/:id",
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id).populate(
            {
                path: "reviews",
                populate: {
                    path: "author"
                }
            }
        ).populate("author");
        console.log(campground);
        let currentUser
        if (req.user) {
            currentUser = req.user
        } else{
            currentUser = null

        }
        if (!campground) {
            req.flash("error", "Can not find Campground")
            return res.redirect("/campgrounds")
        }
        res.render("campgrounds/show", {
            campground,
            currentUser
        });
    })
);

router.get(
    "/makeCampGround",
    catchAsync(async (req, res) => {
        const camp = new Campground({
            title: "daniel",
        });
        await camp.save();
        res.send("camp");
    })
);

router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res) => {

        

        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            req.flash("error", "Can not find Campground")
            return res.redirect("/campgrounds")
        }


        res.render("campgrounds/edit", {
            campground,
        });
    })
);

router.put(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res) => {
        

        
        const campground = await Campground.findByIdAndUpdate(
            req.params.id,
            req.body
        );
        if (!campground) {
            req.flash("error", "Can not find Campground")
            return res.redirect("/campgrounds")
        }
        await campground.save();
        req.flash("success", "Successfully updatted Campground")

        res.redirect(`/campgrounds/${req.params.id}`);
    })
);

router.delete(
    "/:id",
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res) => {
        
        let delCampground = await Campground.findByIdAndDelete(req.params.id);
        req.flash("success", "Successfully Deleted a Campground")
        res.redirect("/campgrounds");
    })
);


module.exports = router