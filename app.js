const express = require("express");
const app = express();
const path = require("path");
const Joi = require("joi");
const { CampgroundSchema, reviewSchema } = require("./schemas");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const bodyParser = require("body-parser");
const Review = require("./models/review");
const logger = require("morgan");

require("./config/database");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(logger("dev"));
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

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

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {
      campgrounds,
    });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/showBody", (req, res) => {
  console.log(req.body);

  res.status(200).json(req.body);
});

app.post(
  "/campgrounds/new",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // console.log(req.body)
    // let campgroundObj = req.body;
    // const CampgroundSchema = Joi.object({
    //   title: Joi.string().required(),
    //   price: Joi.number().required().min(0),
    //   image: Joi.string().required(),
    //   location: Joi.string().required(),
    //   description: Joi.string().required(),
    // });
    // const { error } = CampgroundSchema.validate(req.body);

    // if (error) {
    //   console.log(error);
    //   const msg = error.details.map((val) => val.message).join(',');
    //   throw new ExpressError(msg, 400);
    // }
    const campground = new Campground(req.body);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    console.log(campground);
    res.render("campgrounds/show", {
      campground,
    });
  })
);

app.get(
  "/makeCampGround",
  catchAsync(async (req, res) => {
    const camp = new Campground({
      title: "daniel",
    });
    await camp.save();
    res.send("camp");
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", {
      campground,
    });
  })
);

app.put(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    console.log(req.body);
    let campground = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    await campground.save();

    res.redirect(`/campgrounds/${req.params.id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    let delCampground = await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);

app.post(
  "/campgrounds/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    console.log(req.body);
    const { id } = req.params;
    let campground = await Campground.findById(id);
    const review = new Review(req.body);
    campground.reviews.push(review._id);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  catchAsync(async (req, res, nect) => {
    const { id, reviewId } = req.params;

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect("/campgrounds/" + id);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No Something Is Wrong";
  res.status(statusCode).render("error", {
    err,
  });
});
app.listen(3000, () => {
  console.log("Port 3000");
});
