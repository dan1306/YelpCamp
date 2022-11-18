const express = require("express");
const passport = require("passport");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const {logOut} = require("../middleware")


router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({
        email,
        username
      });
      const registeredUser = await User.register(user, password);
     
      req.login(registeredUser, err => {
        if (err) {
          return next(err)
        }
        req.flash("success", "Welcome To Yelp Camp");
        res.redirect("/campgrounds");
      });
     
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  // console.log("LOGMEIN", req.session.returnTo)
  let prevUrl
  if (req.session.returnTo) {
    prevUrl = req.session.returnTo
  } else {
    prevUrl = '/campgrounds'
  }
  res.render("users/login", {
    prevUrl
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const redirecturl = req.body.prevUrl
    req.flash('success', "welcome back")
        res.redirect(redirecturl)
  }
);

router.get('/logout', logOut, catchAsync((req, res) => {
    res.redirect('/campgrounds')

}))

module.exports = router;
