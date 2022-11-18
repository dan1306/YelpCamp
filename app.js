const express = require("express");
const app = express();
const path = require("path");
const Joi = require("joi");
const {
  CampgroundSchema,
  reviewSchema
} = require("./schemas");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const bodyParser = require("body-parser");
const Review = require("./models/review");
const logger = require("morgan");
const session = require('express-session')
const flash = require("connect-flash")

const passport = require("passport")
const LocalStratergy = require("passport-local")
const User = require('./models/user')

const userRoutes = require('./routes/user')
const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews');


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
app.use(express.static(path.join(__dirname, "public")))

const sessionConfig = {
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
  
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStratergy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  // console.log(req.session)
  res.locals.user = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')

  next()
})


app.use('/', userRoutes)
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)

app.get("/", (req, res) => {
  res.render("home");
});



app.post("/showBody", (req, res) => {
  console.log(req.body);

  res.status(200).json(req.body);
});






app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const {
    statusCode = 500
  } = err;
  if (!err.message) err.message = "Oh No Something Is Wrong";
  res.status(statusCode).render("error", {
    err,
  });
});
app.listen(3000, () => {
  console.log("Port 3000");
});